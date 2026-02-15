"use client";

import { useState } from "react";

interface ShareButtonsProps {
  tool: { name: string; slug: string; shortDescription: string };
  variant?: "inline" | "icon" | "full" | "expanded";
  className?: string;
}

export default function ShareButtons({
  tool,
  variant = "expanded",
  className = "",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);

  const url = `https://gofreetool.com/tools/${tool.slug}`;
  const text = `${tool.name} - free, browser-based. No signup needed.`;
  const twitterText = `${tool.name} - free, no signup, browser-based.`;

  const whatsappText = `Check out this free ${tool.name}: ${url}`;

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(tool.name)}`,
    email: `mailto:?subject=${encodeURIComponent(`Free ${tool.name} I found useful`)}&body=${encodeURIComponent(`Check out this free ${tool.name}:\n\n${tool.shortDescription}\n\n${url}`)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const shareData = { title: tool.name, text, url };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled - fall through to copy
      }
    }

    handleCopyLink();
  };

  // Icon-only variant
  if (variant === "icon") {
    return (
      <button
        onClick={handleNativeShare}
        className={`p-2 text-gray-500 hover:text-teal-600 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        aria-label="Share this tool"
        title="Share this tool"
      >
        <ShareIcon className="w-5 h-5" />
      </button>
    );
  }

  // Inline text link variant
  if (variant === "inline") {
    return (
      <button
        onClick={handleNativeShare}
        className={`text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400
                    dark:hover:text-teal-300 hover:underline transition-colors ${className}`}
      >
        {copied ? "Link copied!" : "Share this tool"}
      </button>
    );
  }

  // Full button variant
  if (variant === "full") {
    return (
      <button
        onClick={handleNativeShare}
        className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-600
                    dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400
                    border border-gray-200 dark:border-gray-700 rounded-lg
                    hover:border-teal-300 dark:hover:border-teal-700 transition-colors ${className}`}
      >
        <ShareIcon className="w-4 h-4" />
        {copied ? "Link copied!" : "Share this tool"}
      </button>
    );
  }

  // Expanded variant with platform buttons
  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {/* WhatsApp */}
        <a
          href={shareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                     bg-[#25D366] text-white hover:bg-[#128C7E]
                     transition-colors"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Twitter/X */}
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                     bg-gray-100 text-gray-700 hover:bg-[#1DA1F2] hover:text-white
                     dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-[#1DA1F2]
                     transition-colors"
          aria-label="Share on Twitter"
        >
          <XIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Twitter</span>
        </a>

        {/* LinkedIn */}
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                     bg-gray-100 text-gray-700 hover:bg-[#0A66C2] hover:text-white
                     dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-[#0A66C2]
                     transition-colors"
          aria-label="Share on LinkedIn"
        >
          <LinkedInIcon className="w-4 h-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all
                      ${copied
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              Copy
            </>
          )}
        </button>

        {/* More dropdown for less common platforms */}
        <div className="relative group">
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                       bg-gray-100 text-gray-700 hover:bg-gray-200
                       dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700
                       transition-colors"
          >
            <MoreIcon className="w-4 h-4" />
            <span className="hidden sm:inline">More</span>
          </button>
          <div className="absolute right-0 mt-1 py-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg
                          border border-gray-200 dark:border-gray-700 opacity-0 invisible
                          group-hover:opacity-100 group-hover:visible transition-all z-10">
            <a
              href={shareUrls.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <RedditIcon className="w-4 h-4" />
              Reddit
            </a>
            <a
              href={shareUrls.email}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <EmailIcon className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
      />
    </svg>
  );
}
