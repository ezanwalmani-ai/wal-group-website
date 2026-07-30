export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

export async function listDriveFiles(accessToken: string, query?: string): Promise<DriveFile[]> {
  try {
    let url = `https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,webViewLink,iconLink,createdTime,modifiedTime,size)&pageSize=20&orderBy=modifiedTime desc`;
    if (query && query.trim()) {
      const q = encodeURIComponent(`name contains '${query.replace(/'/g, "\\'")}' and trashed = false`);
      url += `&q=${q}`;
    } else {
      url += `&q=${encodeURIComponent('trashed = false')}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Drive API error (${res.status})`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (err: any) {
    console.error('Error fetching Google Drive files:', err);
    throw err;
  }
}

export async function uploadFileToDrive(
  accessToken: string,
  fileName: string,
  content: string | Blob,
  mimeType: string = 'text/csv'
): Promise<DriveFile> {
  try {
    const metadata = {
      name: fileName,
      mimeType: mimeType
    };

    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );

    const fileBlob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
    formData.append('file', fileBlob);

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Failed to upload file to Drive (${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Error uploading file to Drive:', err);
    throw err;
  }
}

export async function deleteDriveFile(accessToken: string, fileId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok && res.status !== 204) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Failed to delete file (${res.status})`);
    }

    return true;
  } catch (err: any) {
    console.error('Error deleting Drive file:', err);
    throw err;
  }
}
