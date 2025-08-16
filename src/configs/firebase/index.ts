import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './config'

// Interface cho options của upload
interface UploadOptions {
  file: File | Blob // File hoặc Blob để upload
  path: string // Đường dẫn trong Firebase Storage (ví dụ: 'images/media/banner_123')
  fileName?: string // Tên file tùy chỉnh (nếu không cung cấp, dùng timestamp)
}

// Interface cho response của upload
interface UploadResponse {
  downloadURL: string
  storagePath: string
  fileName: string
}

class FirebaseStorageService {
  private storage = storage

  /**
   * Upload file lên Firebase Storage
   * @param options - UploadOptions object chứa file, path và fileName
   * @returns Promise<string> - URL tải xuống của file
   */
  async uploadFile({ file, path, fileName }: UploadOptions): Promise<string> {
    try {
      // Tạo tên file duy nhất nếu không được cung cấp
      const finalFileName = fileName ? `${fileName}_${Date.now()}` : `${Date.now()}`
      const extension = (file.type.split('/')[1] || 'file').toLowerCase() // Lấy extension từ MIME type
      const storagePath = `${path}/${finalFileName}.${extension}`
      const storageRef = ref(this.storage, storagePath)

      // Upload file
      const snapshot = await uploadBytes(storageRef, file)

      // Lấy URL tải xuống
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Error uploading to Firebase:', error)
      throw error
    }
  }

  /**
   * Upload file với response chi tiết hơn
   * @param options - UploadOptions object
   * @returns Promise<UploadResponse> - Object chứa downloadURL, storagePath và fileName
   */
  async uploadFileWithDetails({ file, path, fileName }: UploadOptions): Promise<UploadResponse> {
    try {
      // Tạo tên file duy nhất nếu không được cung cấp
      const finalFileName = fileName ? `${fileName}_${Date.now()}` : `${Date.now()}`
      const extension = (file.type.split('/')[1] || 'file').toLowerCase()
      const storagePath = `${path}/${finalFileName}.${extension}`
      const storageRef = ref(this.storage, storagePath)

      // Upload file
      const snapshot = await uploadBytes(storageRef, file)

      // Lấy URL tải xuống
      const downloadURL = await getDownloadURL(snapshot.ref)

      return {
        downloadURL,
        storagePath,
        fileName: finalFileName,
      }
    } catch (error) {
      console.error('Error uploading to Firebase:', error)
      throw error
    }
  }

  /**
   * Xóa file từ Firebase Storage
   * @param fileUrl - URL của file cần xóa
   * @returns Promise<void>
   */
  async removeFile(fileUrl: string): Promise<void> {
    try {
      // Tạo reference từ URL
      const storageRef = ref(this.storage, fileUrl)

      // Xóa file
      await deleteObject(storageRef)
    } catch (error) {
      console.error('Error removing from Firebase:', error)
      throw error
    }
  }

  /**
   * Lấy download URL từ storage path
   * @param storagePath - Đường dẫn trong storage
   * @returns Promise<string> - Download URL
   */
  async getDownloadURL(storagePath: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, storagePath)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('Error getting download URL:', error)
      throw error
    }
  }

  /**
   * Tạo storage reference từ path
   * @param path - Đường dẫn trong storage
   * @returns StorageReference
   */
  createStorageRef(path: string) {
    return ref(this.storage, path)
  }

  /**
   * Kiểm tra file có tồn tại không
   * @param fileUrl - URL của file
   * @returns Promise<boolean>
   */
  async fileExists(fileUrl: string): Promise<boolean> {
    try {
      const storageRef = ref(this.storage, fileUrl)
      await getDownloadURL(storageRef)
      return true
    } catch (error) {
      return false
    }
  }
}

// Tạo instance mặc định
export const firebaseStorage = new FirebaseStorageService()
