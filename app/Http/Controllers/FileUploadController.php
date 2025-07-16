<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class FileUploadController extends Controller
{
    private const MAX_FILE_SIZE = 2048;

    public function upload(Request $request)
    {
        try {
            $request->validate([
                'file' => [
                    'required',
                    'file',
                    'max:' . self::MAX_FILE_SIZE,
                    'mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt,zip,rar'
                ],
            ], [
                'file.required' => 'Please select a file to upload.',
                'file.file' => 'The selected file is not valid.',
                'file.max' => 'File size cannot exceed ' . number_format(self::MAX_FILE_SIZE / 1024, 1) . 'MB. Please choose a smaller file.',
                'file.mimes' => 'File type not supported. Please upload a valid file (jpeg, png, jpg, gif, pdf, doc, docx, txt, zip, rar).',
            ]);

            $file = $request->file('file');

            if ($file->getSize() > (self::MAX_FILE_SIZE * 1024)) {
                return response()->json([
                    'error' => 'File size is too large. Maximum allowed size is ' . number_format(self::MAX_FILE_SIZE / 1024, 1) . 'MB. Your file is ' . number_format($file->getSize() / (1024 * 1024), 2) . 'MB.',
                    'max_size' => self::MAX_FILE_SIZE / 1024,
                    'current_size' => round($file->getSize() / (1024 * 1024), 2)
                ], 413);
            }

            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('chat_attachments', $fileName, 'public');

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'url' => Storage::url($path),
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => round($file->getSize() / (1024 * 1024), 2) . 'MB'
            ]);
        } catch (ValidationException $e) {
            $errors = $e->errors();
            $errorMessage = '';

            if (isset($errors['file'])) {
                $errorMessage = $errors['file'][0];
            }

            return response()->json([
                'error' => $errorMessage,
                'validation_errors' => $errors
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while uploading the file: ' . $e->getMessage()
            ], 500);
        }
    }
}
