<script lang="ts">
  import Logo from "../_components/Logo.svelte";
  import BigLinkButton from '../_components/BigLinkButton.svelte';
  import { metatags } from '@roxi/routify'
  metatags.title = 'CTF Archive'
  metatags.description = 'CTF Archive'
</script>

<main>
  <header>
    <div class="banner-logo">
      <Logo />
    </div>
    <section>
      <h1>시간에 구애받지 않고 즐기는<br />CTF 문제풀이 사이트</h1>
      <section>
        모두 안녕!<br />기존에 출제된 문제들을 재현하여 사이트에서 채점받고, 랭킹을 보며 실력을 증진할 수 있습니다.
      </section>
    </section>
  </header>
</main>

<div class="jumbotron">
	<div class="container">
		<h1>Scoreboard</h1>
	</div>
</div>

<div class="container">
  <div id="score-graph" class="row d-flex align-items-center">
		<div class="col-md-12 text-center">
			<i class="fas fa-circle-notch fa-spin fa-3x fa-fw spinner"></i>
		</div>
	</div>
  
	<div id="scoreboard" class="row">
		<div class="col-md-12">
			<table class="table table-striped">
				<thead>
					<tr>
						<td scope="col" width="10px"><b>Place</b></td>
						<td scope="col"><b>User</b></td>
						<td scope="col"><b>Score</b></td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row" class="text-center">1</th>
						<td>L0TUS</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
  * {
    text-align: center;
  }

  main > * {
    padding: 5rem;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 20rem;
    background: url("/assets/images/banner-background.jpg") center center / cover;
    color: #212121;
  }
  .banner-logo {
    font-size: 4em;
  }

  header > section {
    font-size: 1.05em;
    margin-top: 3em;
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem 0;
  }
  main > section {
    padding: 3rem 0;
  }
  .links {
    padding: 2rem 0;
  }

  @media (min-width: 1024px) {
    header {
      flex-direction: row;
    }
    header > section {
      margin-top: 0;
      margin-left: 6em;
    }
  }

  @media (min-width: 640px) {
    .links {
      flex-direction: row;
    }
  }
</style>