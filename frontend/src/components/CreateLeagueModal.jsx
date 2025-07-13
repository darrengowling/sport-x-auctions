import React, { useState } from 'react';
import { X, Trophy, Users, Lock, Globe, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

const CreateLeagueModal = ({ isOpen, onClose, onCreateLeague }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'private',
    maxParticipants: 8,
    entryFee: '',
    prize: '',
    description: '',
    format: 'knockout'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('League name is required');
      setLoading(false);
      return;
    }

    if (formData.maxParticipants < 2) {
      setError('Minimum 2 participants required');
      setLoading(false);
      return;
    }

    try {
      // Generate a league code for private leagues
      const leagueCode = formData.type === 'private' 
        ? `${formData.name.substring(0, 3).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
        : null;

      const newLeague = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        participants: 1, // Creator is first participant
        status: 'joining',
        prize: formData.prize || 'To be announced',
        entryFee: formData.entryFee || 'Free',
        creator: 'You',
        code: leagueCode,
        description: formData.description || 'No description provided',
        maxParticipants: formData.maxParticipants,
        format: formData.format,
        createdAt: new Date().toISOString()
      };

      onCreateLeague(newLeague);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        type: 'private',
        maxParticipants: 8,
        entryFee: '',
        prize: '',
        description: '',
        format: 'knockout'
      });
    } catch (error) {
      setError('Failed to create league. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-blue-600" />
            Create League
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* League Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              League Name *
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Enter league name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* League Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              League Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-all ${
                  formData.type === 'private' 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setFormData({...formData, type: 'private'})}
              >
                <CardContent className="p-4 text-center">
                  <Lock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Private</h3>
                  <p className="text-xs text-gray-500 mt-1">Invite only with code</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${
                  formData.type === 'public' 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setFormData({...formData, type: 'public'})}
              >
                <CardContent className="p-4 text-center">
                  <Globe className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium text-gray-900">Public</h3>
                  <p className="text-xs text-gray-500 mt-1">Anyone can join</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Participants
            </label>
            <select
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={4}>4 Teams</option>
              <option value={6}>6 Teams</option>
              <option value={8}>8 Teams</option>
              <option value={10}>10 Teams</option>
              <option value={12}>12 Teams</option>
              <option value={16}>16 Teams</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              League Format
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="knockout">Knockout</option>
              <option value="round-robin">Round Robin</option>
              <option value="swiss">Swiss System</option>
            </select>
          </div>

          {/* Entry Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Fee (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                name="entryFee"
                placeholder="e.g., ₹500 or Free"
                value={formData.entryFee}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Prize */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prize Pool (Optional)
            </label>
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                name="prize"
                placeholder="e.g., ₹10,000 or Glory"
                value={formData.prize}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              placeholder="Describe your league..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          >
            {loading ? 'Creating League...' : 'Create League'}
          </Button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-start space-x-2">
            <Users className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">League Creation Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Private leagues get a unique join code</li>
                <li>• You can invite friends using the code</li>
                <li>• Entry fees are optional and for fun</li>
                <li>• Leagues start when minimum teams join</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeagueModal;