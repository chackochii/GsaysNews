import Admin from './admin.model.js'; // ✅ default import

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
