---
title: 어뷰징 대응기: 갑자기 좋아요가 10000개가 됐다
date: 2026-07-16
tags: [supabase, react, typescript]
description: 블로그 좋아요 기능 어뷰징을 프론트엔드·DB 레벨에서 대응한 과정 기록
---

### 사건의 시작

어느 날 [블로그 포스트](https://white-jang.github.io/#/2026-07-06-SupabaseViewsLikes)의 좋아요가 갑자기 10000개가 되어 있었다. 친구들에게만 보여줬던 실바니안 하우스 같은 블로그인데... 이렇게 된다고!? 당황스러웠지만, 원인을 파악하고 수정할 좋은 기회인 것 같았다. 원인을 파악하고 재발 방지를 위해 어떤 조치를 취했는지 기록을 남겨보려 한다.

현재 블로그는 Supabase로만 처리가 되어있다. Supabase anon key는 프론트엔드 번들에 그대로 포함되므로 누구든 브라우저 네트워크 탭만 열면 키를 꺼낼 수 있고, 직접 RPC를 반복 호출하는 것도 어렵지 않다. 좋아요 기능은 유지하고 싶으므로, 프론트엔드/DB로 나눠 방법을 생각해 보았다.

우선 좋아요 수는 Supabase 대시보드에서 직접 `0`으로 초기화했다. 이제 재발 방지를 위해 어떤 조치를 했는지 소개하도록 하겠다.

### 프론트엔드: 중복 클릭 방지

외부 API 직접 호출은 막기 어렵지만, UI 레벨에서 빠른 연속 클릭으로 인한 중복 요청은 막을 수 있다.

`usePostStats` 훅에 `likeLoading` 상태를 추가했다.

```ts
const [likeLoading, setLikeLoading] = useState(false);

const handleLike = async () => {
  if (likeLoading) return;
  setLikeLoading(true);
  try {
    // increment / decrement 로직
  } finally {
    setLikeLoading(false);
  }
};
```

버튼엔 `disabled`와 `opacity-50`을 추가해서 응답 오기 전까진 클릭이 불가능하도록 막았다.

```tsx
<button
  onClick={handleLike}
  disabled={likeLoading}
  className="... disabled:opacity-50 ..."
>
```

### DB 레벨: 상한선 설정

SQL 함수 안에서 `RAISE EXCEPTION`을 던지면 클라이언트에 API 에러(`P0001`)로 내려온다. `increment_likes` 함수에 상한선 체크를 추가했다.

```sql
CREATE OR REPLACE FUNCTION increment_likes(post_slug text)
RETURNS SETOF post_stats LANGUAGE plpgsql AS $$
DECLARE
  current_likes integer;
BEGIN
  SELECT likes INTO current_likes
  FROM post_stats
  WHERE slug = post_slug;

  IF current_likes >= 9999 THEN
    RAISE EXCEPTION 'likes limit reached';
  END IF;

  INSERT INTO post_stats (slug, views, likes)
  VALUES (post_slug, 0, 1)
  ON CONFLICT (slug) DO UPDATE
    SET likes = post_stats.likes + 1;

  RETURN QUERY SELECT * FROM post_stats WHERE slug = post_slug;
END;
$$;
```

### 한계점 🥹

두 가지 대응 모두 완벽하진 않다.

- 프론트엔드 방어는 UI 레벨이라 API 직접 호출엔 무력하다.
- DB 상한선은 값을 막는 거지 호출 횟수를 막는 건 아니다. 9999번 호출하면 결국 상한선까지는 쌓인다.

호출 횟수 자체를 막으려면 rate limiting이 필요한데, Supabase 무료 플랜에서는 지원하지 않고 백엔드 프록시가 있어야 한다. 개인 블로그 수준에선 이 정도로 충분할 것 같다고 판단하여 조치하였고, 추가적인 문제가 생길 경우 새로운 해결 방법을 생각해 보아야겠다. (Supabase에서 다른 시스템으로 변경한다든지..)
