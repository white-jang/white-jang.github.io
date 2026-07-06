---
title: Supabase로 조회수 · 좋아요 기능 구현하기
date: 2026-07-06
tags: [supabase, react, typescript]
description: 별도 백엔드 없이 Supabase로 블로그 포스트의 조회수와 좋아요 토글 기능을 구현한 과정을 기록합니다.
---

# Supabase로 조회수 · 좋아요 기능 구현하기

블로그에 두 가지 기능을 추가했다.

- 포스트를 열면 조회수가 1 오른다.
- 하트 버튼을 누르면 좋아요가 오르고, 다시 누르면 취소된다.

별도 서버 없이 **Supabase**만으로 구현했다.

---

## 왜 Supabase?

정적 사이트라 백엔드가 없다. 그렇다고 조회수나 좋아요를 클라이언트에만 두면 새로고침하면 날아간다.

Supabase는 PostgreSQL 기반 BaaS로, 클라이언트에서 직접 DB에 쿼리할 수 있다. 무료 플랜으로 이 정도 규모엔 충분하다.

---

## 1. 테이블 설계

```sql
create table public.post_stats (
  slug    text primary key,
  views   integer not null default 0,
  likes   integer not null default 0
);
```

`slug`를 PK로 잡아 포스트 파일명(예: `2026-07-06-supabase-views-likes`)이 곧 식별자가 된다.

---

## 2. RPC 함수 세 개

조회수 · 좋아요를 원자적(Atomic)으로 업데이트하기 위해 PostgreSQL 함수를 사용했다. 클라이언트에서 직접 `UPDATE`를 날리면 동시성 문제가 생길 수 있기 때문이다.

### 조회수 증가

```sql
create or replace function increment_views(post_slug text)
returns setof post_stats language plpgsql as $$
begin
  insert into post_stats (slug, views, likes)
  values (post_slug, 1, 0)
  on conflict (slug) do update
    set views = post_stats.views + 1;
  return query select * from post_stats where slug = post_slug;
end;
$$;
```

처음 방문하면 INSERT, 이후엔 UPDATE한다. `ON CONFLICT`로 upsert를 구현해 별도 존재 확인 없이 처리한다.

### 좋아요 증가 / 감소

```sql
create or replace function increment_likes(post_slug text)
returns setof post_stats language plpgsql as $$
begin
  insert into post_stats (slug, views, likes)
  values (post_slug, 0, 1)
  on conflict (slug) do update
    set likes = post_stats.likes + 1;
  return query select * from post_stats where slug = post_slug;
end;
$$;

create or replace function decrement_likes(post_slug text)
returns setof post_stats language plpgsql as $$
begin
  update post_stats
    set likes = greatest(likes - 1, 0)
  where slug = post_slug;
  return query select * from post_stats where slug = post_slug;
end;
$$;
```

감소 함수에서 `greatest(likes - 1, 0)`을 쓴 이유는 좋아요가 음수가 되는 걸 방지하기 위해서다.

---

## 3. RLS + 권한 설정

Supabase는 기본적으로 RLS(Row Level Security)가 활성화되어 있어서, 정책과 권한을 명시적으로 열어줘야 한다.

```sql
-- anon 사용자가 읽고 쓸 수 있도록
grant select, insert, update on public.post_stats to anon;

-- RLS 정책
create policy "allow read" on public.post_stats
  for select using (true);

create policy "allow insert" on public.post_stats
  for insert with check (true);

create policy "allow update" on public.post_stats
  for update using (true);
```

이걸 빠뜨리면 RPC 호출 시 `42501 permission denied` 에러가 난다.

---

## 4. React Hook

```ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface PostStats {
  views: number;
  likes: number;
}

export function usePostStats(slug: string) {
  const [stats, setStats] = useState<PostStats>({ views: 0, likes: 0 });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked_${slug}`) === "true");

    supabase
      .rpc("increment_views", { post_slug: slug })
      .then(({ data, error }) => {
        if (error) console.error("[views]", error);
        if (data?.[0]) setStats({ views: data[0].views, likes: data[0].likes });
      });
  }, [slug]);

  const handleLike = async () => {
    if (liked) {
      const { data, error } = await supabase.rpc("decrement_likes", {
        post_slug: slug,
      });
      if (error) {
        console.error("[likes]", error);
        return;
      }
      if (data?.[0]) {
        setStats({ views: data[0].views, likes: data[0].likes });
        setLiked(false);
        localStorage.removeItem(`liked_${slug}`);
      }
    } else {
      const { data, error } = await supabase.rpc("increment_likes", {
        post_slug: slug,
      });
      if (error) {
        console.error("[likes]", error);
        return;
      }
      if (data?.[0]) {
        setStats({ views: data[0].views, likes: data[0].likes });
        setLiked(true);
        localStorage.setItem(`liked_${slug}`, "true");
      }
    }
  };

  return { stats, liked, handleLike };
}
```

포스트를 열면 `increment_views`를 바로 호출해 조회수를 올리고, 반환값으로 현재 stats를 업데이트한다.

좋아요 상태는 `localStorage`로 브라우저별로 관리한다. 서버에 사용자 정보를 저장하지 않아도 되고, 새로고침해도 상태가 유지된다.

---

## 마치며

Supabase RPC 함수를 쓰니 원자성 보장이 깔끔하게 됐다. 클라이언트에서 `select` → `update` 두 번 치는 방식은 동시 요청이 겹치면 카운트가 틀릴 수 있는데, PostgreSQL 함수 안에서 처리하면 그 걱정이 없다.

좋아요 취소는 처음엔 막아두려 했다가, 실수로 누를 수 있으니 토글로 바꿨다. `greatest(likes - 1, 0)`으로 음수 방지만 해두면 충분했다.
