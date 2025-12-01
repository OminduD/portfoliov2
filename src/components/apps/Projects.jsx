import React, { useState, useEffect } from 'react';
import { Book, Star, GitFork } from 'lucide-react';
import './Projects.css';

const Projects = ({ onOpenUrl }) => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.github.com/users/OminduD/repos?sort=updated')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRepos(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch repos", err);
                setLoading(false);
            });
    }, []);

    const handleProjectClick = (e, url) => {
        if (onOpenUrl) {
            e.preventDefault();
            onOpenUrl(url);
        }
    };

    if (loading) {
        return <div className="projects-container">Loading projects...</div>;
    }

    return (
        <div className="projects-container">
            {repos.map(repo => (
                <a
                    key={repo.id}
                    href={repo.html_url}
                    onClick={(e) => handleProjectClick(e, repo.html_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card"
                >
                    <div className="project-name">
                        <Book size={16} />
                        {repo.name}
                    </div>
                    <div className="project-desc">
                        {repo.description || "No description available."}
                    </div>
                    <div className="project-meta">
                        <div className="project-lang">
                            <span className="lang-dot" style={{ backgroundColor: getLangColor(repo.language) }} />
                            {repo.language || "Unknown"}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={12} /> {repo.stargazers_count}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <GitFork size={12} /> {repo.forks_count}
                            </span>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
};

const getLangColor = (lang) => {
    const colors = {
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Python: '#3572A5',
        Java: '#b07219',
        // Add more as needed
    };
    return colors[lang] || '#ccc';
};

export default Projects;
