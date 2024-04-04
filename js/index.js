document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm === '') {
        alert('Please enter a search term');
        return;
      }
  
      try {
        const users = await searchUsers(searchTerm);
        displayUsers(users);
      } catch (error) {
        console.error('Error searching users:', error);
        alert('Failed to search users. Please try again later.');
      }
    });
  
    async function searchUsers(username) {
      const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const data = await response.json();
      return data.items;
    }
  
    function displayUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <img src="${user.avatar_url}" alt="Avatar" width="50">
          <a href="${user.html_url}" target="_blank">${user.login}</a>
          <button class="view-repos" data-username="${user.login}">View Repos</button>
        `;
        userList.appendChild(listItem);
      });
      bindViewReposButtons();
    }
  
    async function displayUserRepos(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user repositories: ${response.status}`);
      }
      const repos = await response.json();
      displayRepos(repos);
    }
  
    function displayRepos(repos) {
      reposList.innerHTML = '';
      repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.textContent = repo.name;
        reposList.appendChild(listItem);
      });
    }
  
    function bindViewReposButtons() {
      const viewReposButtons = document.querySelectorAll('.view-repos');
      viewReposButtons.forEach(button => {
        button.addEventListener('click', async () => {
          const username = button.getAttribute('data-username');
          try {
            const repos = await displayUserRepos(username);
            displayRepos(repos);
          } catch (error) {
            console.error('Error fetching user repositories:', error);
            alert('Failed to fetch user repositories. Please try again later.');
          }
        });
      });
    }
  });