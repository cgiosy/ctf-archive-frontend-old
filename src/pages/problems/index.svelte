<script lang="ts">
  const ranking = [
    {
      id: 10000,
      category: "웹",
      difficulty: 1,
      title: "Easy Web",
      solves: 4321,
      solved: true,
    },
    {
      id: 10001,
      category: "웹",
      difficulty: 3,
      title: "Easy Web 2",
      solves: 432,
      solved: true,
    },
    {
      id: 10002,
      category: "웹",
      difficulty: 6,
      title: "Hard Web",
      solves: 43,
      solved: true,
    },
    {
      id: 10003,
      category: "웹",
      difficulty: 10,
      title: "Hard Web 2",
      solves: 4,
      solved: false,
    },
    {
      id: 20001,
      category: "리버싱",
      difficulty: 2,
      title: "Easy Rev",
      solves: 1234,
      solved: true,
    },
    {
      id: 20002,
      category: "리버싱",
      difficulty: 5,
      title: "Easy Rev 2",
      solves: 123,
      solved: true,
    },
    {
      id: 20003,
      category: "리버싱",
      difficulty: 9,
      title: "Hard Rev",
      solves: 12,
      solved: false,
    },
    {
      id: 20004,
      category: "리버싱",
      difficulty: 14,
      title: "Hard Rev 2",
      solves: 1,
      solved: false,
    },
  ];
</script>

<main>
  <table>
    <thead>
      <tr>
        <td><a href="/problems?sort=id_asc">번호</a></td>
        <td><a href="/problems?sort=category_asc">분류</a></td>
        <td><a href="/problems?sort=difficulty_asc">난이도</a></td>
        <td class="no-link">제목</td>
        <td><a href="/problems?sort=solves_desc">푼 사람</a></td>
      </tr>
    </thead>
    <tbody>
      {#each ranking as { id, category, difficulty, title, solves, solved }}
        <tr>
          <td><a href="/problem/{id}" class={solved ? "solved" : ""}>{id}</a></td>
          <td><a href="/problems?query=tag:{category}">{category}</a></td>
          <td><a href="/problems?query={difficulty}">{difficulty}</a></td>
          <td><a href="/problem/{id}">{title}</a></td>
          <td class="no-link">{solves}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }
  td:nth-child(1) {
    width: 6em;
  }
  td:nth-child(2) {
    width: 8em;
  }
  td:nth-child(3) {
    width: 5em;
  }
  td:nth-child(5) {
    width: 7em;
  }
  td.no-link,
  a {
    padding: 1rem;
  }
  a {
    display: inline-flex;
    width: 100%;
  }
  a:hover {
    text-decoration: underline;
  }
  .solved {
    color: #00c853;
  }
</style>
