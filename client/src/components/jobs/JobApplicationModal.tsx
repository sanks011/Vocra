import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  jobTitle: string;
  company: string;
  loading?: boolean;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  jobTitle,
  company,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    yearsOfExperience: '',
    expectedSalary: '',
    availability: '',
    whyInterested: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setResumeFile(file);
      } else {
        alert('File size must be less than 5MB');
      }
    } else {
      alert('Please select a PDF, DOC, or DOCX file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('coverLetter', formData.coverLetter);
    submitData.append('yearsOfExperience', formData.yearsOfExperience);
    submitData.append('expectedSalary', formData.expectedSalary);
    submitData.append('availability', formData.availability);
    submitData.append('whyInterested', formData.whyInterested);
    
    if (resumeFile) {
      submitData.append('resume', resumeFile);
    }

    await onSubmit(submitData);
  };

  const resetForm = () => {
    setFormData({
      coverLetter: '',
      yearsOfExperience: '',
      expectedSalary: '',
      availability: '',
      whyInterested: ''
    });
    setResumeFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Submit your application for {jobTitle} at {company}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're interested in this position..."
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Years of Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              placeholder="e.g., 3"
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
            />
          </div>

          {/* Expected Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Expected Salary</Label>
            <Input
              id="salary"
              placeholder="e.g., $80,000 - $100,000"
              value={formData.expectedSalary}
              onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
            />
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select 
              value={formData.availability} 
              onValueChange={(value) => handleInputChange('availability', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="When can you start?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="2weeks">2 weeks notice</SelectItem>
                <SelectItem value="1month">1 month</SelectItem>
                <SelectItem value="2months">2 months</SelectItem>
                <SelectItem value="negotiable">Negotiable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Why Interested */}
          <div className="space-y-2">
            <Label htmlFor="whyInterested">Why are you interested in this role?</Label>
            <Textarea
              id="whyInterested"
              placeholder="What excites you about this opportunity?"
              value={formData.whyInterested}
              onChange={(e) => handleInputChange('whyInterested', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label>Resume</Label>
            {!resumeFile ? (
              <Card 
                className={`border-2 border-dashed transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <CardContent className="flex flex-col items-center justify-center py-8 px-4">
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 text-center mb-2">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    Choose File
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{resumeFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
