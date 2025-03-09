import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  animeId: {
    type: Number,
    required: true,
    index: true
  },
  episodes: [{
    episodeNumber: {
      type: Number,
      required: true
    },
    links: [{
      hoster: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }]
  }]
}, { timestamps: true });

export const Link = mongoose.models.Link || mongoose.model('Link', linkSchema); 