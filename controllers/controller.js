const { User, Profile, Post, Interaction, PostInteraction } = require('../models');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

class Controller {
    static async home(req, res) {
        try {
            if (!req.session.userId) {
            res.render('tidder');
            } else {
            res.redirect('home');
            }
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }


   static async getHome(req, res) {
        try {
            const posts = await Post.findAll({
            include: [{ model: User, as: 'User' }],
            order: [['createdAt', 'DESC']]
            });
            res.render('users/home', { posts, session: req.session });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    // ========== USERS ==========
    static async getRegister(req, res) {
        try {
            res.render('register');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postRegister(req, res) {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ username, email, password: hashedPassword });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'your_email@gmail.com',
                pass: 'your_app_password'
                }
            });

            await transporter.sendMail({
                from: 'your_email@gmail.com',
                to: email,
                subject: 'Welcome!',
                text: `Welcome to Tidder, ${username}!`
            });

            res.redirect('/login');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async getLogIn(req, res) {
        try {
            res.render('login');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postLogIn(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.render('users/login', { error: 'Invalid email or password' });
            }

            req.session.userId = user.id;
            req.session.username = user.username;

            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async logOut(req, res) {
        try {
            req.session.destroy(err => {
                if (err) throw err;
                res.redirect('/login');
        });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    // ========== PROFILES ==========
    static async getCreateProfile(req, res) {
        try {
            res.render('createProfile');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postCreateProfile(req, res) {
        try {
            const { bio, photoProfile } = req.body;
            await Profile.create({ bio, photoProfile, userId: req.session.userId });
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async getEditProfile(req, res) {
        try {
            const profile = await Profile.findByPk(req.params.id);
            res.render('editProfile', { profile });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postEditProfile(req, res) {
        try {
            const { bio, photoProfile } = req.body;
            await Profile.update({ bio, photoProfile }, { where: { id: req.params.id } });
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async deleteProfile(req, res) {
        try {
            await Profile.destroy({ where: { id: req.params.id } });
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async getProfile(req, res) {
        try {
            const profile = await Profile.findByPk(req.params.id, {
                include: [User]
            });
            res.render('profile', { profile });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    // ========== POSTS ==========
    static async getCreatePost(req, res) {
        try {
            res.render('createPost');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postCreatePost(req, res) {
        try {
        const { title, content, imageUrl } = req.body;
        await Post.create({ title, content, imageUrl, userId: req.session.userId });
        res.redirect('/home');
        } catch (error) {
        console.log(error);
        res.send(error);
        }
    }

    static async getEditPost(req, res) {
        try {
            const post = await Post.findByPk(req.params.id);
            res.render('editPost', { post });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postEditPost(req, res) {
        try {
            const { title, content, imageUrl } = req.body;
            await Post.update({ title, content, imageUrl }, { where: { id: req.params.id } });
        res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async deletePost(req, res) {
        try {
            await Post.destroy({ where: { id: req.params.id } });
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    // ========== INTERACTIONS ==========
    static async upVotePost(req, res) {
        try {
            const interaction = await Interaction.create({ upVote: 1, downVote: 0 });
            await PostInteraction.create({ postId: req.params.postId, interactionId: interaction.id });
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async downVotePost(req, res) {
        try {
            const interaction = await Interaction.create({ downVote: 1, upVote: 0 });
            await PostInteraction.create({ postId: req.params.postId, interactionId: interaction.id });
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async commentPost(req, res) {
        try {
            const { comment } = req.body;
            const interaction = await Interaction.create({ comment, upVote: 0, downVote: 0 });
            await PostInteraction.create({ postId: req.params.postId, interactionId: interaction.id });
        res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
}

module.exports = Controller;
