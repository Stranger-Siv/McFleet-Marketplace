import 'dotenv/config';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import User from '../models/User.js';

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ['identify']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ discordId: profile.id });

                if (!user) {
                    user = await User.create({
                        discordId: profile.id,
                        discordUsername: profile.username,
                        discordAvatar: profile.avatar,
                        role: 'user'
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
