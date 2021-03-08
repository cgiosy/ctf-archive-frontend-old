<script lang="ts">
import Logo from "./Logo.svelte";
</script>

<nav>
  <div id="menus">
    <div id="links">
      <ul>
        <li id="logo-link"><a href="/"><Logo /></a></li>
        <li><a href="/problems">문제</a></li>
        <li><a href="/ranking">랭킹</a></li>
        <li><a href="/search">검색</a></li>
        <li id="user-link"><a href="/login">로그인</a></li>
      </ul>
    </div>
  </div>
  <div id="details">
    <div id="details-links">
      <ul class="empty-list"></ul>
      <ul>
        <li><a href="/problems">목록</a></li>
        <li><a href="/tags">태그</a></li>
      </ul>
      <ul>
        <li><a href="/ranking">전체</a></li>
        <li><a href="/ranking/friends">친구</a></li>
        <li><a href="/ranking/contribution">기여</a></li>
      </ul>
      <ul id="user-links">
        <li><a href="/profile">프로필</a></li>
        <li><a href="/notifications">알림</a></li>
        <li><a href="/settings">설정</a></li>
      </ul>
    </div>
  </div>
</nav>

<style>
  * {
    display: flex;
  }
  #links, #details-links {
    width: 100%;
    max-width: 70rem;
  }
  #logo-link {
    font-size: 1.25rem;
  }

  /* Navigation Bar */

  nav, #details {
    pointer-events: none;
  }
  nav, #menus, #details {
    width: 100%;
    justify-content: center;
    z-index: 4;
  }
  #menus {
    pointer-events: auto;
  }
  #menus, #details {
    box-shadow:
      0 0.25rem 0.25rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 0.5)),
      0 0.125rem 0.125rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 1));
  }
  nav {
    position: fixed;
    flex-direction: column;
    align-items: center;
    top: 0;
  }

  #details {
    height: 12rem;
    background-color: rgba(var(--background-color), 0.9);
    opacity: 0;
    transition: opacity .25s;
  }
  #menus:hover + #details, #details:hover {
    opacity: 1;
    pointer-events: auto;
  }

  #menus {
    background-color: rgb(var(--background-color));
  }
  #links, #details-links {
    height: 100%;
  }
  #links {
    height: 3rem;
  }
  #details-links {
    padding-top: 0.5rem;
  }

  ul {
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  #details-links > ul {
    flex-direction: column;
  }

  li, #details-links > ul {
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
  li:not(#logo-link):hover {
    font-weight: bold;
    text-shadow:
      0 0 1.5em rgba(var(--text-color), calc(var(--background-opacity) * 9)),
      0 0 1em rgba(var(--text-color), calc(var(--background-opacity) * 6));
  }
  #links li {
    height: 100%;
  }
  #details-links > .empty-list, #logo-link {
    width: 7rem;
    justify-content: start;
  }
  #user-link, #user-links {
    justify-self: end;
    margin-left: auto;
  }
</style>