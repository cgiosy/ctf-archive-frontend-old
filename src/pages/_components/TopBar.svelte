<script lang="ts">
  import { useMutation, useQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { get, post } from "../../libs/fetcher";
  import { getLocalStorage } from "../../libs/utils";
  import Logo from "./Logo.svelte";
  import ProfileImage from "./ProfileImage.svelte";
  import { UserAuth } from "../../types";
  import type { IUserPrivateInfo } from "../../types";

  const getMyInfo = () => get<IUserPrivateInfo>("/users/-");

  const queryClient = useQueryClient();
  const logoutMutation = useMutation(() => post<{}>("/logout"), {
    onSuccess: () => {
      localStorage.removeItem("sessionid");
      queryClient.invalidateQueries();
    },
    onError: () => {
      localStorage.removeItem("sessionid");
      queryClient.invalidateQueries();
    },
  });

  const sessionid = useQuery("sessionid", getLocalStorage<string>("sessionid"), {
    cacheTime: 0,
    staleTime: 0,
  });
  const me = useQuery({
    queryFn: getMyInfo,
    enabled: false,
  });
  let loggedIn = false;

  const logout = () => $logoutMutation.mutate();

  $: {
    if ((loggedIn = $sessionid.data != null)) {
      me.setOptions({
        queryKey: "me",
        queryFn: getMyInfo,
        retry: false,
      });
    }
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
        <li class="discord-link">
          <a href="https://discord.gg/QhgjPfYy2E"
            ><svg viewBox="0 0 71 55"
              ><g clip-path="url(#clip0)"
                ><path
                  d="M60.105 4.898A58.55 58.55 0 0045.653.415a.22.22 0 00-.233.11 40.784 40.784 0 00-1.8 3.697c-5.456-.817-10.886-.817-16.23 0-.485-1.164-1.201-2.587-1.828-3.697a.228.228 0 00-.233-.11 58.386 58.386 0 00-14.451 4.483.207.207 0 00-.095.082C1.578 18.73-.944 32.144.293 45.39a.244.244 0 00.093.167c6.073 4.46 11.955 7.167 17.729 8.962a.23.23 0 00.249-.082 42.08 42.08 0 003.627-5.9.225.225 0 00-.123-.312 38.772 38.772 0 01-5.539-2.64.228.228 0 01-.022-.378c.372-.279.744-.569 1.1-.862a.22.22 0 01.23-.03c11.619 5.304 24.198 5.304 35.68 0a.219.219 0 01.233.027c.356.293.728.586 1.103.865a.228.228 0 01-.02.378 36.384 36.384 0 01-5.54 2.637.227.227 0 00-.121.315 47.249 47.249 0 003.624 5.897.225.225 0 00.249.084c5.801-1.794 11.684-4.502 17.757-8.961a.228.228 0 00.092-.164c1.48-15.315-2.48-28.618-10.497-40.412a.18.18 0 00-.093-.084zm-36.38 32.427c-3.497 0-6.38-3.211-6.38-7.156 0-3.944 2.827-7.156 6.38-7.156 3.583 0 6.438 3.24 6.382 7.156 0 3.945-2.827 7.156-6.381 7.156zm23.593 0c-3.498 0-6.38-3.211-6.38-7.156 0-3.944 2.826-7.156 6.38-7.156 3.582 0 6.437 3.24 6.38 7.156 0 3.945-2.798 7.156-6.38 7.156z"
                /></g
              ><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h71v55H0z" /></clipPath></defs
              ></svg
            ></a
          >
        </li>
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
        {#if loggedIn && me !== null && $me.isSuccess && $me.data.auth >= UserAuth.Creator}
          <li>
            <a href={`/problems/create`}>만들기</a>
          </li>
        {/if}
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
  .discord-link {
    width: 3.5rem;
  }
  .discord-link,
  .user-links {
    margin-left: auto;
  }
  .profile-link {
    font-size: 1.5em;
  }
  svg {
    fill: rgba(var(--text-color), calc(var(--background-opacity) * 16));
    height: 1.666em;
    width: 2.151515em;
  }
</style>
