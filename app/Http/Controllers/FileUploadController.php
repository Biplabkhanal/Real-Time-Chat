<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        try {
            if (!$request->hasFile('file')) {
                return response()->json([
                    'error' => 'No file uploaded'
                ], 400);
            }

            $file = $request->file('file');

            // Validate the file
            $request->validate([
                'file' => 'required|file|max:100240', // 10MB max size
            ]);

            // Generate unique filename
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            // Store the file in the public disk
            $path = $file->storeAs('chat_attachments', $fileName, 'public');

            // Return the file URL and name
            return response()->json([
                'url' => Storage::url($path),
                'name' => $file->getClientOriginalName(),
                'path' => $path
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
