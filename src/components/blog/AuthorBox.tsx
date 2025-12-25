import { Twitter, Linkedin, Globe } from "lucide-react";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  website?: string;
}

interface Author {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  socialLinks: unknown;
}

interface AuthorBoxProps {
  author: Author;
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  const socialLinks = author.socialLinks as SocialLinks | null;

  return (
    <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-bold">
            {author.name.charAt(0)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{author.name}</h3>
          
          {author.bio && (
            <p className="text-[var(--text-muted)] text-sm mb-3">
              {author.bio}
            </p>
          )}

          {/* Social Links */}
          {socialLinks && (
            <div className="flex items-center gap-3">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Website"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
