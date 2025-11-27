using Microsoft.AspNetCore.Components.Forms;

namespace MLVScanWeb.Pages
{
    public class DroppedBrowserFile : IBrowserFile
    {
        private readonly byte[] _fileData;
        private readonly string _fileName;
        private readonly string _contentType;
        private readonly long _size;
        private readonly DateTimeOffset _lastModified;

        public DroppedBrowserFile(byte[] fileData, string fileName, string contentType)
        {
            _fileData = fileData ?? throw new ArgumentNullException(nameof(fileData));
            _fileName = fileName ?? throw new ArgumentNullException(nameof(fileName));
            _contentType = contentType ?? "application/octet-stream";
            _size = fileData.LongLength;
            _lastModified = DateTimeOffset.Now;
        }

        public string Name => _fileName;
        public DateTimeOffset LastModified => _lastModified;
        public long Size => _size;
        public string ContentType => _contentType;

        public Stream OpenReadStream(long maxAllowedSize = 512000, CancellationToken cancellationToken = default)
        {
            if (_size > maxAllowedSize)
            {
                throw new InvalidOperationException($"File size ({_size} bytes) exceeds maximum allowed size ({maxAllowedSize} bytes).");
            }

            return new MemoryStream(_fileData, false);
        }
    }
}

