import { useEffect, useState } from 'react';

const githubClientId = 'Iv23liUYOlQX5RFMy7Bq';
const username = 'suryansh-business-work';
// https://github.com/settings/apps/repo-analyser-app#private-key

function App() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState(localStorage.getItem('github_token'));

  const handleLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}`;
    window.location.href = githubAuthUrl;
  };

  useEffect(() => {
    // Parse the code parameter from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Store the code in the browser's localStorage
      localStorage.setItem('github_token', code);
      setCode(code);
      // Remove the code from the URL (to clean it up)
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      // Get Access Token

      const tokenResponse: any = fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: githubClientId,
          client_secret: "ae388e808ce6a818813e366d384c50edbc25e645",
          code,
        }),
      });

      const tokenData = tokenResponse.json();
      const accessToken = tokenData.access_token;

      console.log(accessToken);
    }
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await response.json();
        setRepos(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repos:', error);
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  return (
    <>
      <button onClick={handleLogin}>Login with GitHub</button>
      <div>
        <h2>Repositories of {username}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {repos.map((repo: any) => (
              <li key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default App
