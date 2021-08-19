const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
// const { authentication } = require('../validation/verifytoken');

//update user
router.put('/:id', async (req, res) =>{
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.body.userId, {
                $set: req.body,
            });
            res.status(200).json('Account updated');
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        return res.status(403).json('You are trying to update an account that does not belong to you.');
    }
});

//delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.body.userId);
            res.status(200).json('Account deleted');
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(403).json('You are trying to delete an account that does not belong to you.');
    }
});

//get a user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);

        //info more specific
        const {password, updateAt, createAt, ...other} = user._doc;

        res.status(200).json(user);
    } catch (err) {
        res.status(403).json(err);
    }
});

module.exports = router;