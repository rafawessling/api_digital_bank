const validatePassword = (req, res, next) => {
    const { bankPassword } = req.query;

    if (!bankPassword || bankPassword !== 'Cubos123Bank') {
        return res.status(401).json({ message: 'The password is incorrect or missing.' });
    }

    next();
};

export { validatePassword };
