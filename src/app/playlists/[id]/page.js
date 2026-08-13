import PlaylistDetailClient from "./PlaylistDetailClient";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export default async function PlaylistPage({ params }) {
  const { id } = await params;
  
  await dbConnect();
  const decodedId = decodeURIComponent(id);
  const dbPlaylist = await Playlist.findOne({ playlistId: decodedId }).lean();

  if (!dbPlaylist) {
    notFound();
  }

  // Convert MongoDB _id to string for serialization to client component
  const playlist = {
    ...dbPlaylist,
    _id: dbPlaylist._id.toString(),
    id: dbPlaylist.playlistId,
    tracks: dbPlaylist.tracks.map(t => ({
      ...t,
      _id: t._id.toString()
    }))
  };

  return <PlaylistDetailClient playlist={playlist} />;
}
