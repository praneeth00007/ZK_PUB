import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2006/api';

class IDDocumentService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Upload ID document
   * @param {string} userId - User ID
   * @param {File} file - ID document file
   * @returns {Promise<Object>} - Upload response
   */
  async uploadIDDocument(userId, file) {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('file', file);

      const response = await this.api.post('/id-documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error uploading ID document:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Extract text from document
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} - Extraction response
   */
  async extractTextFromDocument(documentId) {
    try {
      const response = await this.api.post(`/id-documents/${documentId}/extract-text`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error extracting text:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Parse birth year from extracted text
   * @param {string} documentId - Document ID
   * @param {string} extractedText - Extracted text
   * @returns {Promise<Object>} - Parsing response
   */
  async parseBirthYearFromText(documentId, extractedText) {
    try {
      const response = await this.api.post(`/id-documents/${documentId}/parse-birth-year`, extractedText);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error parsing birth year:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Generate ZK proof
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} - ZK proof response
   */
  async generateZKProof(documentId) {
    try {
      const response = await this.api.post(`/id-documents/${documentId}/generate-zk-proof`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error generating ZK proof:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Verify ZK proof on blockchain
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} - Blockchain verification response
   */
  async verifyZKProofOnBlockchain(documentId) {
    try {
      const response = await this.api.post(`/id-documents/${documentId}/verify-blockchain`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error verifying ZK proof on blockchain:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Complete age verification
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} - Verification completion response
   */
  async completeAgeVerification(documentId) {
    try {
      const response = await this.api.post(`/id-documents/${documentId}/complete-verification`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error completing age verification:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get document by ID
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} - Document data
   */
  async getDocumentById(documentId) {
    try {
      const response = await this.api.get(`/id-documents/${documentId}`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error getting document:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get document by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Document data
   */
  async getDocumentByUserId(userId) {
    try {
      const response = await this.api.get(`/id-documents/user/${userId}`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error getting document by user ID:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Check if user is age verified
   * @param {string} userId - User ID (email)
   * @returns {Promise<Object>} - Verification status
   */
  async isUserAgeVerified(userId) {
    try {
      const response = await this.api.get(`/image/verify-age/${userId}`);

      return {
        success: true,
        data: response.data.data?.isAgeVerified || false,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error checking verification status:', error);
      return {
        success: false,
        data: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get verification statistics
   * @returns {Promise<Object>} - Statistics data
   */
  async getVerificationStats() {
    try {
      const response = await this.api.get('/id-documents/stats');

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error getting verification stats:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Complete workflow: Upload document and process through all steps
   * @param {string} userId - User ID (email)
   * @param {File} file - ID document file
   * @returns {Promise<Object>} - Complete workflow result
   */
  async completeWorkflow(userId, file) {
    try {
      console.log('Starting complete ID document verification workflow...');

      const formData = new FormData();
      formData.append('email', userId);
      formData.append('image', file);

      const response = await this.api.post('/image/generate-zk-proof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Complete workflow finished successfully!');

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error in complete workflow:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}

// Export singleton instance
export const idDocumentService = new IDDocumentService();
export default idDocumentService;
