const username = 'twitter'; // Replace with your GitHub username
const apiUrl = `https://api.github.com/users/${username}`;
const repositoriesUrl = `https://api.github.com/users/${username}/repos`;
let page = 1;
const perPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((user) => {
      displayUserProfile(user);
      loadRepositories(page);
    })
    .catch((error) => console.error('Error fetching user data:', error));

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn.addEventListener('click', () => loadRepositories(--page));
  nextBtn.addEventListener('click', () => loadRepositories(++page));
});

function displayUserProfile(user) {
  const profileContainer = document.getElementById('profile');
  const profileImg = document.getElementById('profileImg');
  profileImg.innerHTML = `<img src="${user.avatar_url}" alt="Profile Image">`;
  profileContainer.innerHTML = `
        
        <h2>${user.name || user.login}</h2>
        <p>${user.location || 'Location not available'}</p>
        <p>${user.bio || 'Bio not available'}</p>
        <p>Followers: ${user.followers}</p>
        <p>Following: ${user.following}</p>
        <p>Public Repositories: ${user.public_repos}</p>
        ${
          user.blog
            ? `<p>Blog: <a href="${user.blog}" target="_blank">${user.blog}</a></p>`
            : ''
        }
        ${
          user.twitter_username
            ? `<p>Twitter: <a href="https://twitter.com/${user.twitter_username}" target="_blank">${user.twitter_username}</a></p>`
            : ''
        }
        ${
          user.email
            ? `<p>Email: <a href="mailto:${user.email}">${user.email}</a></p>`
            : ''
        }
      `;
}

function displayRepositories(repositories) {
  const reposContainer = document.getElementById('repositories');
  reposContainer.innerHTML = '';

  if (repositories.length === 0) {
    reposContainer.innerHTML += '<p>No public repositories available.</p>';
    return;
  }

  repositories.forEach(async (repo) => {
    const repoElement = document.createElement('div');
    repoElement.className = 'repo';

    repoElement.innerHTML = `
          <strong>${repo.name}</strong>
          <p>${repo.description || 'No description available'}</p>
          <h5>${await getLanguages(repo.languages_url)}</h5>
        `;

    reposContainer.appendChild(repoElement);
  });

  updatePaginationButtons();
}

function loadRepositories(newPage) {
  page = newPage;

  const reposUrl = `${repositoriesUrl}?per_page=${perPage}&page=${page}`;

  fetch(reposUrl)
    .then((response) => response.json())
    .then((reposData) => displayRepositories(reposData))
    .catch((error) => console.error('Error fetching repositories:', error));
}

function updatePaginationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === Math.ceil(user.public_repos / perPage);
}

async function getLanguages(languagesUrl) {
  const response = await fetch(languagesUrl);
  const languages = await response.json();
  return Object.keys(languages).join(', ');
}
