<script lang="ts">
  import { params } from "@roxi/routify";
  import { useQuery } from "@sveltestack/svelte-query";
  import { get } from "../../libs/fetcher";
  import ExpIcon from "../_components/ExpIcon.svelte";
  import ProfileImage from "../_components/ProfileImage.svelte";
  import type { IUserPublicInfo } from "../../types";
  import { expsSum } from "../../libs/utils";

  let username: string;
  const getUserProfile = () => get<IUserPublicInfo>("/users/" + username);

  const user = useQuery({
    queryFn: getUserProfile,
    enabled: false,
  });
  const ranking: number = 0;

  $: {
    username = String($params.username);
    user.setOptions({
      queryKey: ["users", username],
      queryFn: getUserProfile,
    });
  }
</script>

<main>
  {#if $user.isSuccess}
    <section
      class="first profile-background"
      style="background-image: linear-gradient(rgba(0, 0, 0, 0.5625), rgba(0, 0, 0, 0.5625)), url('{$user
        .data.profileBackground}')"
    >
      <div class="wrapper">
        <div class="user">
          <ProfileImage src={$user.data.profileImage} size="lg" alt={$user.data.username} />
          <div class="wrapper2">
            <div class="wrapper3">
              <ExpIcon exps={$user.data.exps} />
              <h1 class="username">
                {$user.data.username}
                <sub class="ranking">#{new Intl.NumberFormat().format(ranking)}</sub>
              </h1>
            </div>
            <p class="description">{$user.data.description}</p>
          </div>
        </div>
        <div class="info">
          <p><b>{new Intl.NumberFormat().format($user.data.solves)}</b> 개의 맞은 문제</p>
          <p><b>{new Intl.NumberFormat().format(expsSum($user.data.exps))}</b> 경험치</p>
        </div>
      </div>
      <div class="solves" />
    </section>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
  main,
  section {
    contain: content;
  }
  section {
    display: flex;
    width: 100%;
  }
  .first {
    min-height: calc(100vh - 3rem);
  }
  .profile-background {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6rem 0.5rem;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 3rem);
    /* background-color: rgba(255, 255, 255, calc(var(--background-opacity) * 2)); */
    color: rgb(255, 255, 255);
    text-shadow: 0 0 0.75em rgba(255, 255, 255, 0.75);
  }
  .wrapper > :first-child {
    border-radius: 1.5rem 1.5rem 0 0;
  }
  .wrapper > :last-child {
    border-radius: 0 0 1.5rem 1.5rem;
  }
  .wrapper2 {
    margin-left: 4em;
  }
  .user,
  .info {
    display: flex;
    width: 100%;
    max-width: var(--content-max-width);
    align-items: center;
    justify-content: center;
    /* background-color: rgba(255, 255, 255, calc(var(--background-opacity) * 18.5)); */
    padding: 3rem 1rem;
  }
  .wrapper3 {
    display: flex;
    align-items: center;
    font-size: 1.5em;
  }
  .username {
    font-size: 2em;
    margin: -0.5em 0.5em 0 0.5em;
  }
  .ranking {
    font-family: Montserrat;
    font-size: 0.5em;
    margin-left: 1em;
    vertical-align: bottom;
  }
  .description {
    font-size: 1.125em;
  }
  .info {
    flex-direction: column;
    font-size: 1.5em;
  }
  .info > p {
    margin: 0.5em 0;
  }
  .info b {
    font-size: 1.25em;
    margin-right: 0.125em;
  }
  p {
    display: flex;
    align-items: center;
  }

  @media (min-width: 48em) {
  }

  @media (min-width: 64em) {
  }
</style>
