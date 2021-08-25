<script lang="ts">
  import { useMutation, useQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { get, post } from "../../libs/fetcher";
  import { getLocalStorage } from "../../libs/utils";
  import Logo from "./Logo.svelte";
  import ProfileImage from "./ProfileImage.svelte";
  import { IUserPrivateInfo, UserAuth } from "../../types";

  const getMyInfo = () => get<IUserPrivateInfo>("/users/-");

  const queryClient = useQueryClient();
  const logoutMutation = useMutation(() => post<{}>("/logout"), {
    onSuccess: () => {
      localStorage.removeItem("sessionid");
      queryClient.invalidateQueries();
    },
  });

  const sessionid = useQuery("sessionid", getLocalStorage<string>("sessionid"));
  const me = useQuery({
    queryFn: getMyInfo,
    enabled: false,
  });
  let loggedIn = false;

  const logout = () => $logoutMutation.mutate();

  $: {
    if ((loggedIn = $sessionid.data != null))
      me.setOptions({
        queryKey: "me",
        queryFn: getMyInfo,
        retry: false,
      });
  }
</script>

<nav>
  <div class="menus">
    <div class="links">
      <ul>
        <li class="logo-link"><a href="/"><Logo /></a></li>
        <li><a href="/">문제</a></li>
        <li><a href="/contests">대회</a></li>
        <li><a href="/ranking">랭킹</a></li>
        <li class="user-link">
          {#if loggedIn && me !== null && $me.isSuccess}<a
              class="profile-link"
              href={`/profile/${$me.data.username}`}
              ><ProfileImage src={$me.data.profileImage} size="xs" alt={$me.data.username} /></a
            >{:else if $sessionid.data == null}<a href="/login">로그인</a>{/if}
        </li>
      </ul>
    </div>
  </div>
  <div class="details">
    <div class="details-links">
      <ul class="empty-list" />
      <ul>
        <li><a href="/">검색</a></li>
        <li><a href="/tags">태그</a></li>
        {#if loggedIn && me !== null && $me.isSuccess && $me.data.auth >= UserAuth.Creator}<li>
            <a href={`/problems/create`}>만들기</a>
          </li>{/if}
      </ul>
      <ul>
        <li><a href="/contests">목록</a></li>
      </ul>
      <ul>
        <li><a href="/ranking">전체</a></li>
        <li><a href="/ranking/friends">친구</a></li>
        <li><a href="/ranking/contribution">기여</a></li>
      </ul>
      <ul class="user-links">
        {#if loggedIn && me !== null && $me.isSuccess}<li>
            <a href={`/profile/${$me.data.username}`}>프로필</a>
          </li>{/if}
        <li><a href="/notifications">알림</a></li>
        <li><a href="/settings">설정</a></li>
        {#if loggedIn}<li><a href={"/intro"} on:click={logout}>로그아웃</a></li>{/if}
      </ul>
    </div>
  </div>
</nav>

<style>
  * {
    display: flex;
  }
  .links,
  .details-links {
    width: 100%;
    max-width: var(--content-max-width);
  }
  .logo-link {
    font-size: 1.25rem;
  }

  /* Navigation Bar */

  nav,
  .details {
    pointer-events: none;
  }
  nav,
  .menus,
  .details {
    width: 100%;
    justify-content: center;
    z-index: 4;
  }
  .menus {
    pointer-events: auto;
  }
  .menus,
  .details {
    box-shadow: 0 0.25rem 0.25rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 0.5)),
      0 0.125rem 0.125rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 1));
  }
  nav {
    position: fixed;
    flex-direction: column;
    align-items: center;
    top: 0;
    width: 100%;
    height: 15rem;
    contain: size layout;
  }

  .details {
    height: 12rem;
    background-color: rgba(var(--background-color), 0.9);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .menus:hover + .details,
  .details:hover {
    opacity: 1;
    pointer-events: auto;
  }

  .menus {
    background-color: rgb(var(--background-color));
  }
  .links,
  .details-links {
    height: 100%;
  }
  .links {
    height: 3rem;
  }
  .details-links {
    padding-top: 0.5rem;
  }

  ul {
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .details-links > ul {
    flex-direction: column;
  }

  li,
  .details-links > ul {
    width: 5em;
  }
  li {
    transition: text-shadow 0.2s;
  }
  li > a {
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0.333em 0;
  }
  li:not(.logo-link):hover {
    font-weight: bold;
    text-shadow: 0 0 1.5em rgba(var(--text-color), calc(var(--background-opacity) * 9)),
      0 0 1em rgba(var(--text-color), calc(var(--background-opacity) * 6));
  }
  .links li {
    height: 100%;
  }
  .details-links > .empty-list,
  .logo-link {
    width: 7rem;
    justify-content: start;
  }
  .user-link,
  .user-links {
    justify-self: end;
    margin-left: auto;
  }
  .profile-link {
    font-size: 1.5em;
  }
</style>
