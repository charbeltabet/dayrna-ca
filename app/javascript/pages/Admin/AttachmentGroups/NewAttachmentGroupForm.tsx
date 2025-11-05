import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function NewAttachmentGroupForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Please enter a title for the group');
      return;
    }

    setLoading(true);
    router.post(
      '/admin/attachments/groups',
      {
        title: title.trim(),
        description: description.trim()
      },
      {
        preserveState: true,
        onSuccess: () => {
          setTitle('');
          setDescription('');
        },
        onFinish: () => {
          setLoading(false);
        }
      }
    );
  };

  const handleDiscard = () => {
    setTitle('');
    setDescription('');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <div style={{
        width: '100%',
      }}>
        <div style={{
          width: '100%',
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid #ddd',
          padding: '4px 8px',
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            New Group
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
          }}>
            <button
              className="btn btn-error"
              onClick={handleDiscard}
              disabled={loading || (!title && !description)}
            >
              Discard
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || !title.trim()}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </div>
      </div>
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div>
          <label className="label">
            <span className="label-text">Title *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter group title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="Enter group description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  )
}
