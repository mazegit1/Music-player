document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio();
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressContainer = document.querySelector('.progress-container');
    const progress = document.getElementById('progress');
    const title = document.getElementById('title');
    const artist = document.getElementById('artist');
    const coverImage = document.getElementById('cover-image');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const repeatBtn = document.getElementById('repeat');
    const shuffleBtn = document.getElementById('shuffle');
    const volumeSlider = document.getElementById('volume');
    const playlistEl = document.getElementById('playlist');
    const searchInput = document.getElementById('search');
    const themeToggle = document.getElementById('theme-toggle');

    let isPlaying = false;
    let currentSongIndex = 0;
    let repeatSong = false;
    let isShuffling = false;
    let songs = [
        { title: 'Boyle Iyi', artist: 'No 1 hidra', name: './No1-Boyle-Iyi.mp3', cover: './boyle-iyi.jpg' },
        { title: 'Bu benim hayatim', artist: 'No 1 hidra', name: './No1-Bu-Benim-Hayatim.mp3', cover: './bu-benim-hayatim.jpg' },
        { title: 'Hic isik yok', artist: 'No 1 hidra', name: './No1-Hic-Isik-Yok.mp3', cover: './hic-isik-yok1.jpg' },
        { title: 'Cenab Leytenant', artist: 'Azerbaycan', name: './Cenab-Leytenant.mp3', cover: './cenab-leytenant.png' },

    ];

    const loadSong = (index) => {
        const song = songs[index];
        audio.src = song.name;
        title.innerText = song.title;
        artist.innerText = song.artist;
        coverImage.src = song.cover;
        highlightCurrentSong();
    };

    const highlightCurrentSong = () => {
        document.querySelectorAll('#playlist li').forEach((item, index) => {
            item.classList.toggle('active', index === currentSongIndex);
        });
    };

    const playSong = () => {
        isPlaying = true;
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        coverImage.style.transform = 'scale(1.1)';
    };

    const pauseSong = () => {
        isPlaying = false;
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        coverImage.style.transform = 'scale(1)';
    };

    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
        loadSong(currentSongIndex);
        playSong();
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
        loadSong(currentSongIndex);
        playSong();
    });

    audio.addEventListener('timeupdate', () => {
        const { currentTime, duration } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
    });

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    repeatBtn.addEventListener('click', () => {
        repeatSong = !repeatSong;
        repeatBtn.classList.toggle('active', repeatSong);
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.classList.toggle('active', isShuffling);
    });

    audio.addEventListener('ended', () => {
        if (repeatSong) {
            playSong();
        } else if (isShuffling) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * songs.length);
            } while (nextIndex === currentSongIndex);
            currentSongIndex = nextIndex;
            loadSong(currentSongIndex);
            playSong();
        } else {
            nextBtn.click();
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    playlistEl.addEventListener('click', (e) => {
        if (e.target && e.target.nodeName === 'LI') {
            const index = Array.from(playlistEl.children).indexOf(e.target);
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('#playlist li').forEach(item => {
            const songTitle = item.textContent.toLowerCase();
            item.style.display = songTitle.includes(searchTerm) ? 'block' : 'none';
        });
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.querySelector('i').classList.toggle('fa-sun');
        themeToggle.querySelector('i').classList.toggle('fa-moon');
    });

    loadSong(currentSongIndex);
});
