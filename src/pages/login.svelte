<script lang="ts">
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
      $goto(sessionStorage.getItem("lastPage") ?? "/");
    });
  };

  const signin = useMutation(
    () => post<{ sessionid: string }>("/login", { id: text || username, password }),
    {
      onSuccess: (data) => {
        login(data.sessionid);
      },
    }
  );

  const signup = useMutation(() => {
    if (text.includes("@")) {
      email = text;
    } else {
      username = text;
    }
    step = 1;
    return new Promise(() => {});
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

<main>
  <div class="wrapper">
    <Logo />
    <h1>Sign in</h1>
    <br />
    {#if step === 0}
      <TextInput type="text" bind:value={text}>아이디 / 이메일</TextInput>
      <TextInput type="password" bind:value={password}>비밀번호</TextInput>
      <br />
      <BigButton mutation={signin}>로그인</BigButton>
      <BigButton mutation={signup}>가입</BigButton>
    {:else}
      <TextInput type="text" bind:value={username}>아이디</TextInput>
      <TextInput type="text" bind:value={email}>이메일</TextInput>
      <TextInput type="password" bind:value={password}>비밀번호</TextInput>
      {#if step === 1}
        <br />
        <BigButton mutation={authEmail}>다음</BigButton>
      {:else}
        <TextInput type="text" bind:value={code}>이메일 인증 코드</TextInput>
        <br />
        <BigButton mutation={register}>가입</BigButton>
      {/if}
    {/if}
  </div>
</main>

<style>
  main {
    align-items: center;
    padding: 2em 0;
  }
  main,
  div {
    display: flex;
    flex-direction: column;
    border-radius: 0.75em;
  }
  .wrapper {
    contain: content;
    width: 100%;
    max-width: 35rem;
    padding: 3em 4em;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 3));
    box-shadow: 0 0.0625em 0.5em rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  h1 {
    text-align: center;
  }
</style>
