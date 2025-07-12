import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Video,
  Type,
  Upload,
} from "lucide-react";
import { Button } from "./button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [fontSize, setFontSize] = useState("14");

  // 에디터 초기값 설정
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageHtml = `<img src="${e.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="업로드된 이미지" />`;
        document.execCommand("insertHTML", false, imageHtml);
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoEmbed = () => {
    if (videoUrl) {
      let embedHtml = "";

      // YouTube URL 처리
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        let videoId = "";
        try {
          if (videoUrl.includes("youtube.com/watch?v=")) {
            const urlParams = new URLSearchParams(videoUrl.split("?")[1]);
            videoId = urlParams.get("v") || "";
          } else if (videoUrl.includes("youtu.be/")) {
            videoId = videoUrl
              .split("youtu.be/")[1]
              .split("?")[0]
              .split("/")[0];
          } else if (videoUrl.includes("youtube.com/embed/")) {
            videoId = videoUrl.split("embed/")[1].split("?")[0].split("/")[0];
          }
        } catch (error) {
          console.error("YouTube URL 파싱 실패:", error);
        }

        if (videoId) {
          embedHtml = `<div style="margin: 20px 0; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"><iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        }
      } else {
        // 일반 비디오 링크 또는 다른 임베드 URL
        if (videoUrl.includes("vimeo.com")) {
          // Vimeo 처리
          const vimeoId = videoUrl.split("vimeo.com/")[1]?.split("?")[0];
          if (vimeoId) {
            embedHtml = `<div style="margin: 20px 0; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"><iframe src="https://player.vimeo.com/video/${vimeoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
          }
        } else {
          // 일반 비디오 파일
          embedHtml = `<div style="margin: 20px 0; text-align: center;"><video controls style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"><source src="${videoUrl}" type="video/mp4">비디오를 재생할 수 없습니다.</video></div>`;
        }
      }

      if (embedHtml) {
        if (editorRef.current) {
          editorRef.current.focus();
        }
        document.execCommand("insertHTML", false, embedHtml);
        // 추가 줄바꿈을 위해
        document.execCommand("insertHTML", false, "<br><br>");
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }

      setVideoUrl("");
      setShowVideoModal(false);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    handleCommand("fontSize", size);
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 엔터 키 처리
    if (e.key === "Enter") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "<br><br>");
    }
  };

  const handleInput = (e: React.FormEvent) => {
    // 입력 후 커서 위치 유지
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    handleContentChange();

    // 커서 위치 복원
    if (range && selection) {
      setTimeout(() => {
        try {
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          // 커서 복원 실패 시 무시
        }
      }, 0);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg relative ${className}`}>
      {/* 툴바 */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2 bg-gray-50">
        {/* 텍스트 스타일 */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleCommand("bold")}
            className="p-2"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleCommand("italic")}
            className="p-2"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleCommand("underline")}
            className="p-2"
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>

        {/* 폰트 크기 */}
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-gray-500" />
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="1">작음</option>
            <option value="3">보통</option>
            <option value="5">큼</option>
            <option value="7">매우 큼</option>
          </select>
        </div>

        {/* 정렬 */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleCommand("justifyLeft")}
            className="p-2"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleCommand("justifyCenter")}
            className="p-2"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleCommand("justifyRight")}
            className="p-2"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>

        {/* 미디어 */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="p-2"
          >
            <Image className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowVideoModal(true)}
            className="p-2"
          >
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 에디터 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="p-4 min-h-[200px] focus:outline-none"
        style={{ minHeight: "200px" }}
        suppressContentEditableWarning={true}
      />

      {/* 플레이스홀더 처리 */}
      {!value && (
        <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* 비디오 URL 모달 */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowVideoModal(false);
              setVideoUrl("");
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">비디오 링크 추가</h3>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube URL 또는 비디오 URL을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowVideoModal(false);
                  setVideoUrl("");
                }}
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleVideoEmbed}
                className="bg-pink-500 hover:bg-pink-600"
              >
                추가
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
