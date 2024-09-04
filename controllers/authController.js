const jwt = require('jsonwebtoken');
const UserRegistration = require('../models/UserRegistration');

// Function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user
exports.registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {

        if (password !== confirmPassword) {
            return res.status(400).json({ msg: 'Passwords do not match' });
        }
        let user = await UserRegistration.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new UserRegistration({
            name,
            email,
            password,
        });

        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // jwt.sign(payload,  process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        //     if (err) throw err;
        //     res.json({ token });
        // });
        res.status(201).json({ message: "User registered successfully" , token});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserRegistration.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Email not found' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.json({ msg: 'Logged in successfully', token });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};