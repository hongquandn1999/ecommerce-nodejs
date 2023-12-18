class AccessController {
  signup = async (req, res, next) => {
    try {
      console.log(`:::singup::: ${req.body}`);

      return res.status(200).json({ code: '20001', metadata: 'signup Kiara' });
    } catch (error) {}
  };
}

module.exports = new AccessController();
