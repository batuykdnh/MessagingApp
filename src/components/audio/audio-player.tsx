interface AudioPlayerProps {
    src: string;
    onPlay: () => void;
}


export default function AudioPlayer({src,onPlay}:AudioPlayerProps){
    const audio = new Audio(src);

    const playSound = () => {
        audio.play();
        onPlay(); // Optional: Callback function if you want to trigger something else
    };

    return (
        <button onClick={playSound}>
            Play Sound
        </button>
    );
}

