const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    let jwtToken = req.header("Authorization");
    if (!jwtToken) return res.status(400).send("Unauthorized access: There is no token");
    jwtToken = jwtToken.split(" ")[1];
    if (!jwtToken) return res.status(400).send("Unauthorized access: There is no token");
    try {
        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT);
        req.user = payload;
        next();
    } catch (e) {
        return res.status(400).send("Unauthorized access: Invalid token");
    }
};

module.exports = auth;