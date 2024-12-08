import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

const ApplicationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    coverLetter: "",
    resume: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        resume: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Candidature envoyée !",
      description: "Nous vous contacterons bientôt.",
    });

    setIsSubmitting(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      linkedin: "",
      coverLetter: "",
      resume: null,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-linkedin-text">
            Formulaire de candidature
          </h1>
          <p className="text-muted-foreground">
            Merci de compléter vos informations pour finaliser votre candidature
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">Profil LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/votre-profil"
              value={formData.linkedin}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Lettre de motivation</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              rows={5}
              value={formData.coverLetter}
              onChange={handleInputChange}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">CV (PDF)</Label>
            <Input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-linkedin-blue hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ApplicationForm;