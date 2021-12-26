<script lang="ts">
  import { _ } from "svelte-i18n";
  import { MetaTags } from "svelte-meta-tags";
  import { goto } from "@roxi/routify";
  import { useQueryClient, useMutation } from "@sveltestack/svelte-query";
  import { post } from "../libs/fetcher";
  import { setLocalStorage } from "../libs/utils";
  import BigButton from "./_components/BigButton.svelte";
  import Logo from "./_components/Logo.svelte";
  import TextInput from "./_components/TextInput.svelte";

  let text: string = "";
  let email: string = "";
  let username: string = "";
  let password: string = "";
  let code: string = "";
  let step: number = 0;

  const queryClient = useQueryClient();
  const setSessionId = setLocalStorage<string>("sessionid");

  const login = (sessionid: string) => {
    setSessionId(sessionid);
    queryClient.invalidateQueries().then(() => {
      location.href = sessionStorage.getItem("lastPage") ?? "/";
    });
  };

  const signin = useMutation(
    () => post<{ sessionid: string }>("/signin", { id: text || username, password }),
    {
      onSuccess: (data) => {
        login(data.sessionid);
      },
    }
  );

  const signup = useMutation(async () => {
    if (text.includes("@")) {
      email = text;
    } else {
      username = text;
    }
    step = 1;
  });

  const authEmail = useMutation(() => post("/authenticate_email", { email }), {
    onSuccess: () => {
      step = 2;
    },
  });

  const register = useMutation(
    () => post<{ sessionid: string }>("/register", { code, email, username, password }),
    {
      onSuccess: (data) => {
        login(data.sessionid);
      },
    }
  );
</script>

<MetaTags
  title="Sign in | CTF Archive"
  description="CTF Archive | CTF Challenges, Writeups, Difficulties, Rankings. Search and Play!"
  openGraph={{
    type: "website",
    site_name: "CTF Archive",
    url: location.toString(),
    title: "Sign in | CTF Archive",
    images: [
      {
        url: "https://ctf-archive.com/assets/images/logo-800.png",
        alt: "CTF Archive Logo",
        width: 800,
        height: 800,
      },
    ],
  }}
/>

<main>
  <section>
    <Logo />
    <h1>Sign in</h1>
    <br />
    {#if step === 0}
      <TextInput type="text" bind:value={text}>{$_("auth.idOrEmail")}</TextInput>
      <TextInput type="password" bind:value={password}>{$_("user.password")}</TextInput>
      <br />
      <BigButton mutation={signin}>{$_("auth.signin")}</BigButton>
      <BigButton mutation={signup}>{$_("auth.signup")}</BigButton>
    {:else}
      <TextInput type="text" bind:value={username}>{$_("user.id")}</TextInput>
      <TextInput type="text" bind:value={email}>{$_("auth.email")}</TextInput>
      <TextInput type="password" bind:value={password}>{$_("user.password")}</TextInput>
      {#if step === 1}
        <br />
        <BigButton mutation={authEmail}>{$_("auth.nextStep")}</BigButton>
      {:else}
        <TextInput type="text" bind:value={code}>{$_("auth.verificationCode")}</TextInput>
        <br />
        <BigButton mutation={register}>{$_("auth.signup")}</BigButton>
      {/if}
    {/if}
  </section>
</main>

<style>
  main {
    align-items: center;
    padding: 2em 0;
  }
  main,
  section {
    display: flex;
    flex-direction: column;
    border-radius: 0.75em;
  }
  section {
    contain: content;
    width: 100%;
    max-width: calc(var(--content-max-width) / 2);
    padding: 3em 4em;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 3));
    box-shadow: 0 0.0625em 0.5em rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  h1 {
    text-align: center;
  }
</style>
