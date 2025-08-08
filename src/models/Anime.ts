import mongoose, { Schema, Document } from 'mongoose';

export interface ITitle {
  type: string;
  title: string;
}

export interface IAiredProp {
  day?: number;
  month?: number;
  year?: number;
}

export interface IAired {
  from?: string;
  to?: string;
  prop?: {
    from?: IAiredProp;
    to?: IAiredProp;
  };
  string?: string;
}

export interface IGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface ITrailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
  images?: {
    image_url?: string;
    small_image_url?: string;
    medium_image_url?: string;
    large_image_url?: string;
    maximum_image_url?: string;
  };
}

export interface IImages {
  jpg?: {
    image_url?: string;
    small_image_url?: string;
    large_image_url?: string;
  };
  webp?: {
    image_url?: string;
    small_image_url?: string;
    large_image_url?: string;
  };
}

export interface IRelation {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface IEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese?: string;
  title_romanji?: string;
  aired?: string;
  score?: number;
  filler: boolean;
  recap: boolean;
  forum_url?: string;
}

export interface IAnime extends Document {
  mal_id: number;
  title: string;
  titles: ITitle[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  aired: IAired;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  genres: IGenre[];
  synopsis: string;
  url: string;
  trailer?: ITrailer;
  images: IImages;
  relations?: IRelation[];
  episodes_data?: IEpisode[];
  updated_at: Date;
  added_at: Date;
}

const TitleSchema = new Schema<ITitle>({
  type: { type: String, required: true },
  title: { type: String, required: true }
});

const AiredPropSchema = new Schema<IAiredProp>({
  day: Number,
  month: Number,
  year: Number
});

const AiredSchema = new Schema<IAired>({
  from: String,
  to: String,
  prop: {
    from: AiredPropSchema,
    to: AiredPropSchema
  },
  string: String
});

const GenreSchema = new Schema<IGenre>({
  mal_id: { type: Number, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const TrailerImagesSchema = new Schema({
  image_url: String,
  small_image_url: String,
  medium_image_url: String,
  large_image_url: String,
  maximum_image_url: String
});

const TrailerSchema = new Schema<ITrailer>({
  youtube_id: String,
  url: String,
  embed_url: String,
  images: TrailerImagesSchema
});

const ImageFormatSchema = new Schema({
  image_url: String,
  small_image_url: String,
  large_image_url: String
});

const ImagesSchema = new Schema<IImages>({
  jpg: ImageFormatSchema,
  webp: ImageFormatSchema
});

const RelationSchema = new Schema<IRelation>({
  mal_id: { type: Number, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const EpisodeSchema = new Schema<IEpisode>({
  mal_id: { type: Number, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  title_japanese: String,
  title_romanji: String,
  aired: String,
  score: Number,
  filler: { type: Boolean, required: true },
  recap: { type: Boolean, required: true },
  forum_url: String
});

const AnimeSchema = new Schema<IAnime>({
  mal_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  titles: [TitleSchema],
  type: { type: String, required: true },
  source: { type: String, required: true },
  episodes: { type: Number, required: true },
  status: { type: String, required: true },
  aired: AiredSchema,
  duration: { type: String, required: true },
  rating: { type: String, required: true },
  score: { type: Number, required: true },
  scored_by: { type: Number, required: true },
  rank: { type: Number, required: true },
  popularity: { type: Number, required: true },
  genres: [GenreSchema],
  synopsis: { type: String, required: true },
  url: { type: String, required: true },
  trailer: TrailerSchema,
  images: ImagesSchema,
  relations: [RelationSchema],
  episodes_data: [EpisodeSchema],
  updated_at: { type: Date, default: Date.now },
  added_at: { type: Date, default: Date.now }
});

// Index pour la recherche
AnimeSchema.index({ title: 'text', synopsis: 'text' });
AnimeSchema.index({ 'genres.name': 1 });
AnimeSchema.index({ score: -1 });
AnimeSchema.index({ popularity: 1 });
AnimeSchema.index({ 'aired.prop.from.year': 1 });

export default mongoose.models.Anime || mongoose.model<IAnime>('Anime', AnimeSchema);