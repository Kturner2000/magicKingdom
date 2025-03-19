const getCommentUser = async (req, res) => {
    console.log("comment got");
};

const sendMessage = async (req, res) => {
    console.log("comment sent");
};

const sendComment = async (req, res) => {
    console.log("post sent");
};

module.exports = { getCommentUser, sendMessage, sendComment };
