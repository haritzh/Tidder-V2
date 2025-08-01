const { User, Profile, Post, Interaction, PostInteraction } = require('../models');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

class Controller {
    // ========== HOME ==========
    static async home(req, res) {
        try {
            if (!req.session.userId) {
                res.render('tidder');
            } else {
                res.redirect('/home');
            }
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async getHome(req, res) {
        try {
            const posts = await Post.findAll({
                include: [{ model: User, as: 'postsUser' }],
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
            res.render('users/register', { error: null });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postRegister(req, res) {
    try {
        const { username, email, password } = req.body
        await User.create({ username, email, password })

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

        let errMsg = 'Something went wrong'
        
        if (error.name === 'SequelizeValidationError') {
            errMsg = error.errors.map(e => e.message).join(', ')
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            errMsg = 'Email already used'
        }

        res.render('users/register', { error: errMsg });
    }
}


    static async getLogIn(req, res) {
        try {
            res.render('users/login', { error: null });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postLogIn(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.authenticate(email, password);

            if (!user) {
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
        req.session.destroy(err => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.redirect('/');
            }
        });
    }

    // ========== PROFILES ==========
    static async getProfile(req, res) {
        try {
            const profile = await Profile.findByPk(req.params.id, {
            include: [{ model: User, as: 'user' }]
            });

            if (!profile) {
            return res.status(404).send('Profile not found');
            }

            const user = profile.user;

            res.render('profiles/show', {
            profile,
            user,
            session: req.session
            });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

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

            if (!profile) {
            return res.status(404).send("Profile not found");
            }

            res.render("profiles/edit", {
            profileId: profile.id,
            photoProfile: profile.photoProfile,
            bio: profile.bio,
            session: req.session 
            });
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

    // ========== POSTS ==========
    static async getCreatePost(req, res) {
        try {
            res.render('posts/create');
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
            res.render('posts/edit', { post });
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
            const postId = req.params.id
            await Post.destroy({ where: { id: postId } });
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    // ========== INTERACTIONS ==========
    static async upVotePost(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.session.userId;

            if (!userId) return res.redirect('/login');

            // Cek apakah user sudah pernah vote
            const [interaction, created] = await PostInteraction.findOrCreate({
            where: { PostId: postId, UserId: userId },
            defaults: { type: 'upvote' }
            });

            if (!created) {
            // Kalau sudah pernah vote, update jika beda
            if (interaction.type !== 'upvote') {
                interaction.type = 'upvote';
                await interaction.save();
            }
            }

            res.redirect('/');
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    static async downVotePost(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.session.userId;

            if (!userId) return res.redirect('/login');

            const [interaction, created] = await PostInteraction.findOrCreate({
            where: { PostId: postId, UserId: userId },
            defaults: { type: 'downvote' }
            });

            if (!created) {
            if (interaction.type !== 'downvote') {
                interaction.type = 'downvote';
                await interaction.save();
            }
            }

            res.redirect('/');
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }


    static async commentPost(req, res) {
        try {
            const { comment } = req.body;
            const interaction = await Interaction.create({
                type: 'comment',
                content: comment,
                userId: req.session.userId
            });
            await PostInteraction.create({
                postId: req.params.postId,
                interactionId: interaction.id
            });
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
}

module.exports = Controller;
