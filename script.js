document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const result = await response.json();
    alert(result.message);
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        alert('Connexion réussie!');
    } else {
        alert(result.message);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const channelButtonsContainer = document.getElementById('channelButtons');
    const channelContent = document.getElementById('channelContent');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageForm = document.getElementById('messageForm');
    const messageTitleInput = document.getElementById('messageTitle');
    const messageContentInput = document.getElementById('messageContent');

    let currentChannel = null;

    // Fonction pour charger les channels disponibles
    function loadChannels() {
        // Pour l'exemple, on utilise des channels statiques. Remplace ceci par une requête API pour obtenir les channels réels.
        const channels = ['news', 'announcements', 'general'];

        channels.forEach(channel => {
            const button = document.createElement('button');
            button.classList.add('channel-button');
            button.textContent = channel;
            button.dataset.channel = channel;
            channelButtonsContainer.appendChild(button);
        });
    }

    // Fonction pour charger le contenu des messages du channel
    function loadChannelContent(channel) {
        fetch(`/api/channels/${channel}`)
            .then(response => response.json())
            .then(data => {
                messagesContainer.innerHTML = ''; // Clear previous content
                data.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('news-item');
                    messageDiv.innerHTML = `<h3>${message.title}</h3><p>${message.content}</p>`;
                    messagesContainer.appendChild(messageDiv);
                });
            })
            .catch(error => console.error('Error fetching channel content:', error));
    }

    // Gestion de la sélection des channels
    channelButtonsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('channel-button')) {
            currentChannel = event.target.dataset.channel;
            loadChannelContent(currentChannel);
            channelContent.style.display = 'block'; // Afficher le contenu du channel
        }
    });

    // Gestion de l'envoi de message
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (currentChannel) {
            fetch(`/api/channels/${currentChannel}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: messageTitleInput.value,
                    content: messageContentInput.value
                })
            })
                .then(response => response.json())
                .then(() => {
                    messageTitleInput.value = '';
                    messageContentInput.value = '';
                    loadChannelContent(currentChannel); // Recharger le contenu du channel
                })
                .catch(error => console.error('Error posting message:', error));
        }
    });

    // Charger les channels lors du chargement de la page
    loadChannels();
});

