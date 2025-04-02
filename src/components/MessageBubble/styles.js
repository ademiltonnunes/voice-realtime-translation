const styles = {
    messageBubble: {
        padding: '10px',
        marginBottom: '8px',
        borderRadius: '8px',
        maxWidth: '90%',
        overflowWrap: 'break-word',
    },
    originalBubble: {
        backgroundColor: '#f5f5f5',
        alignSelf: 'flex-end',
    },
    translationBubble: {
        backgroundColor: '#e3f2fd',
        alignSelf: 'flex-start',
    },
    audioContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: '6px',
    },
    audioPlayer: {
        height: '40px',
        maxWidth: '100%',
    },
    loadingIndicator: {
        marginLeft: '8px',
    },
    textContainer: {
        wordBreak: 'break-word',
        width: '100%',
    },
    speakButton: {
        marginTop: '4px',
    }
};

export default styles;