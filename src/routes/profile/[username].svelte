<script lang="ts">
  import { _ } from "svelte-i18n";
  import { MetaTags } from "svelte-meta-tags";
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query";
  import { params } from "@roxi/routify";
  import ExpIcon from "../_components/ExpIcon.svelte";
  import ProfileImage from "../_components/ProfileImage.svelte";
  import { emptyImageUrl, expsSum, getImageUrl, style } from "../../libs/utils";
  import { post } from "../../libs/fetcher";
  import { useMyInfo, useSessionid, useUser } from "../../queries";

  let username: string;
  let profileImageFile: File | null | undefined;
  let profileBackgroundFile: File | null | undefined;

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

  const onChangeProfileBackground = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const { files } = e.currentTarget;
    if (files === null || files.length === 0) {
      profileBackgroundFile = undefined;
      return;
    }
    profileBackgroundFile = files[0];
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

  const uploadProfileBackground = useMutation(
    (file: File) => post<{ id: number }>(`/users/${username}/profile_background`, file),
    {
      onSuccess: reloadProfile,
    }
  );

  const [sessionid] = useSessionid();
  const [user, getUser] = useUser();
  const [me, getMyInfo] = useMyInfo();
  const ranking: number = 0;
  let signedIn = false;

  $: if ($params.username !== undefined) {
    username = $params.username;
  }
  $: getUser(username);
  $: if ((signedIn = !!$sessionid.data)) getMyInfo();
  $: if (profileImageFile != null) {
    $uploadProfileImage.mutate(profileImageFile);
    profileImageFile = null;
  }
  $: if (profileBackgroundFile != null) {
    $uploadProfileBackground.mutate(profileBackgroundFile);
    profileBackgroundFile = null;
  }
</script>

{#if $user.isSuccess}
  <MetaTags
    title="{username} | CTF Archive"
    description={`${$user.data.username} - ${$user.data.description} | ${$user.data.solves} ${$_(
      "profile.solves"
    )} | ${expsSum($user.data.exps)} ${$_("profile.exp")}`}
    openGraph={{
      type: "profile",
      site_name: "CTF Archive",
      url: location.toString(),
      title: username,
      images: [
        {
          url:
            getImageUrl($user.data.profileImage) ??
            getImageUrl($user.data.profileBackground) ??
            `https://ctf-archive.com/assets/images/default-profile-image-lg.png`,
          alt: `${username}'s Profile Image`,
          width: 800,
          height: 800,
        },
        {
          url: "/assets/images/logo-800.png",
          alt: "CTF Archive Logo",
          width: 800,
          height: 800,
        },
      ],
    }}
  />
{/if}

<main>
  {#if $user.isSuccess}
    <section
      class="first profile-background"
      style={style({
        "--background": `url('${getImageUrl($user.data.profileBackground) ?? emptyImageUrl}')`,
      })}
    >
      <div class="wrapper">
        <div class="user">
          {#if signedIn && me !== null && $me.isSuccess && $me.data.username === $user.data.username}
            <label class="profile-image-button">
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
      {#if signedIn && me !== null && $me.isSuccess && $me.data.username === $user.data.username}
        <label class="profile-background-button">
          <input type="file" accept=".jpg,.jpeg,.png,.webp" on:change={onChangeProfileBackground} />
          <svg viewBox="0 0 24 24"
            ><path
              d="M21 6h-3.17L16 4h-6v2h5.12l1.83 2H21v12H5v-9H3v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM8 14c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5-5 2.24-5 5zm5-3c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3zM5 6h3V4H5V1H3v3H0v2h3v3h2z"
            /></svg
          >
        </label>
      {/if}
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
    background-image: linear-gradient(
        rgba(var(--text-color), calc(var(--background-opacity) * 10)),
        rgba(var(--text-color), calc(var(--background-opacity) * 10))
      ),
      var(--background);
    background-position: 50% 25%;
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
  label {
    cursor: pointer;
  }
  .profile-image-button {
    transition: filter 0.125s;
  }
  .profile-image-button:hover,
  .profile-image-button:focus {
    filter: brightness(0.5);
  }
  .profile-background-button {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    top: 1.5em;
    right: 1.5em;
    width: 2.5em;
    height: 2.5em;
    padding: 0.375em;
    fill: rgba(255, 255, 255, 0.825);
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.625);
  }

  @media (min-width: 48em) {
  }

  @media (min-width: 64em) {
  }
</style>
