<script lang="ts">
  import ExpIcon from "../_components/ExpIcon.svelte";
  import ProfileImage from "../_components/ProfileImage.svelte";
  import type { IUserMiniInfo } from "../../types";

  export let user: IUserMiniInfo;
</script>

<a href={"/profile/" + user.username}
  ><ExpIcon exps={user.exps} small={true} /><ProfileImage
    src={user.profileImage}
    alt={user.username}
  />
  {user.username}</a
>

<style>
  a {
    display: block;
  }
</style>
