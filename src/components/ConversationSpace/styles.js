const styles = {
    conversationSpace: {
        padding: '16px',
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
    },
    languageHeader: {
        marginBottom: '16px',
        fontWeight: 500,
    },
    messagesContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        paddingRight: '8px',
        '&::-webkit-scrollbar': {
        width: '8px',
        },
        '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
        '&:hover': {
            background: '#555',
        },
        },
    },
};

export default styles;