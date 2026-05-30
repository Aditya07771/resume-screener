const MAX_FILE_SIZE = 10485760; // 10MB default
const MAX_FILES = 20;
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check file type
  const extension = '.' + file.name.toLowerCase().split('.').pop();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File ${file.name} has unsupported type. Allowed: PDF, DOC, DOCX`,
    };
  }

  return { valid: true };
}

export function validateFiles(files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (files.length > MAX_FILES) {
    errors.push(`Maximum ${MAX_FILES} files allowed`);
  }

  files.forEach((file) => {
    const result = validateFile(file);
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
