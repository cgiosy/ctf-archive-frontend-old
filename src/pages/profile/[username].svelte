<script lang="ts">
  import { _ } from "svelte-i18n";
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query";
  import { params } from "@roxi/routify";
  import ExpIcon from "../_components/ExpIcon.svelte";
  import ProfileImage from "../_components/ProfileImage.svelte";
  import { expsSum } from "../../libs/utils";
  import { post } from "../../libs/fetcher";
  import { useMyInfo, useSessionid, useUser } from "../../queries";

  let username: string;
  let profileImageFile: File | null | undefined;

  const queryClient = useQueryClient();

  const onChangeProfileImage = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const { files } = e.currentTarget;
    if (files === null || files.length === 0) {
      profileImageFile = undefined;
      return;
    }
    profileImageFile = files[0];
  };

  const reloadProfile = () => {
    queryClient.invalidateQueries("users");
    queryClient.invalidateQueries(["user", username]);
    queryClient.invalidateQueries("me");
  };

  const uploadProfileImage = useMutation(
    (file: File) => post<{ id: number }>(`/users/${username}/profile_image`, file),
    {
      onSuccess: reloadProfile,
    }
  );

  const [sessionid] = useSessionid();
  const [user, getUser] = useUser();
  const [me, getMyInfo] = useMyInfo();
  const ranking: number = 0;
  let loggedIn = false;

  $: username = $params.username;
  $: getUser(username);
  $: if ((loggedIn = !!$sessionid.data)) getMyInfo();
  $: if (profileImageFile != null) {
    $uploadProfileImage.mutate(profileImageFile);
    profileImageFile = null;
  }
</script>

<main>
  {#if $user.isSuccess}
    <section
      class="first profile-background"
      style={$user.data.profileBackground
        ? `background-image: linear-gradient(rgba(0, 0, 0, 0.5625), rgba(0, 0, 0, 0.5625)), url('${$user.data.profileBackground}')`
        : "background-color: rgba(var(--text-color), calc(var(--background-opacity) * 10))"}
    >
      <div class="wrapper">
        <div class="user">
          {#if loggedIn && me !== null && $me.isSuccess && $me.data.username === $user.data.username}
            <label>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" on:change={onChangeProfileImage} />
              <ProfileImage src={$user.data.profileImage} size="lg" alt={$user.data.username} />
            </label>
          {:else}
            <ProfileImage src={$user.data.profileImage} size="lg" alt={$user.data.username} />
          {/if}
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
          <p><b>{new Intl.NumberFormat().format($user.data.solves)}</b> {$_("profile.solves")}</p>
          <p>
            <b>{new Intl.NumberFormat().format(expsSum($user.data.exps))}</b>
            {$_("profile.exp")}
          </p>
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
    background-position: 100% 100%;
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
  input {
    display: none;
  }

  @media (min-width: 48em) {
  }

  @media (min-width: 64em) {
  }
</style>
