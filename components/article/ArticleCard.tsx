import { ArticleControllerFindAll200Response } from "@/api";
import { Colors } from "@/constants/theme";
import { getImageUrl } from "@/lib/image";
import { formatRelativeTime } from "@/lib/time";
import { ImageData } from "@/types/api";
import {
  EllipsisVertical,
  Eye,
  FileImage,
  MessageCircleMore,
  Play,
  ThumbsUp,
} from "lucide-react-native";
import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AsyncImage from "../ui/AsyncImage";
import Avatar from "../ui/Avatar";

type ArticleCardProps = {
  data: Omit<
    ArticleControllerFindAll200Response["data"]["data"][number],
    "images"
  > & {
    images: ImageData[] | string[];
  };
};
function ArticleCard({ data }: ArticleCardProps) {
  const { t } = useTranslation();

  const handleArticleClick = useCallback(() => {
    console.log("article click");
  }, []);

  const handleMoreClick = useCallback(() => {
    console.log("more button click");
  }, []);

  const renderCover = useCallback(() => {
    return (
      <View
        style={{
          borderRadius: 8,
          overflow: "hidden",
          borderColor: Colors.border,
        }}
      >
        <AsyncImage
          source={data?.cover}
          contentFit="cover"
          style={{ width: "100%", aspectRatio: 16 / 9 }}
        />

        {/* 添加视频标识 */}
        {data?.type === "video" && (
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -16 }, { translateY: -16 }],
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: 999,

              padding: 12,
            }}
          >
            <Play color={"white"} />
          </View>
        )}
        {/* 添加封面标识 */}
        {data?.cover && data?.type !== "video" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: 20,
              paddingVertical: 2,
              paddingHorizontal: 8,
            }}
          >
            <FileImage color={"white"} size={10} />
          </View>
        )}
      </View>
    );
  }, [data?.type, data?.cover]);

  const renderMedia = () => {
    if (data?.images.length === 1) {
      const image = data?.images[0] as ImageData;
      const aspectRatio =
        image?.width && image?.height ? image.width / image.height : 16 / 9;
      return (
        <AsyncImage
          source={getImageUrl(image, "large")}
          contentFit="cover"
          style={{
            width: "100%",
            aspectRatio: aspectRatio,
            maxHeight: 280,
            borderRadius: 8,
            borderColor: Colors.border,
          }}
        />
      );
    }
    if (data?.images.length === 2) {
      return (
        <View style={{ flexDirection: "row", gap: 2, height: 160 }}>
          <AsyncImage
            source={getImageUrl(data?.images[0], "large")}
            contentFit="cover"
            style={{
              flex: 1,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              borderColor: Colors.border,
            }}
          />
          <AsyncImage
            source={getImageUrl(data?.images[1], "large")}
            contentFit="cover"
            style={{
              flex: 1,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              borderColor: Colors.border,
            }}
          />
        </View>
      );
    }
    if (data?.images.length >= 3) {
      return (
        <View
          style={{
            flexDirection: "row",
            gap: 2,
            height: 140,
            overflow: "hidden",
          }}
        >
          <AsyncImage
            source={getImageUrl(data?.images[0], "large")}
            contentFit="cover"
            style={{
              flex: 1,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              borderColor: Colors.border,
            }}
          />
          <AsyncImage
            source={getImageUrl(data?.images[1], "large")}
            contentFit="cover"
            style={{
              flex: 1,
              borderColor: Colors.border,
            }}
          />
          <AsyncImage
            source={getImageUrl(data?.images[2], "large")}
            contentFit="cover"
            style={{
              flex: 1,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              borderColor: Colors.border,
            }}
          />
        </View>
      );
    }
  };
  return (
    <Pressable onPress={() => handleArticleClick()} style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Avatar
          uri={data.author.avatar}
          size={40}
          avatarFrameUri={
            data?.author?.equippedDecorations?.AVATAR_FRAME?.imageUrl
          }
        />
        <View style={styles.headerInfo}>
          <View style={styles.headerInfoUser}>
            <Text
              style={{
                fontWeight: 500,
              }}
            >
              {data?.author?.nickname || data?.author?.username}
            </Text>
            {data?.author?.equippedDecorations?.ACHIEVEMENT_BADGE?.imageUrl && (
              <AsyncImage
                source={
                  data?.author?.equippedDecorations?.ACHIEVEMENT_BADGE?.imageUrl
                }
                style={{
                  width: 14,
                  height: 14,
                }}
              />
            )}
          </View>
          <Text style={{ color: Colors.secondary, fontSize: 12 }}>
            {formatRelativeTime(data?.createdAt, t)} • {data?.category?.name}
          </Text>
        </View>
        <View style={styles.headerMenu}>
          <Pressable onPress={handleMoreClick}>
            <EllipsisVertical color={Colors.secondary} fontWeight="700" />
          </Pressable>
        </View>
      </View>
      {/* 内容 */}

      <View
        style={{
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ marginVertical: 6, fontSize: 16, fontWeight: "500" }}>
          {data?.title}
        </Text>
        {/* <RenderHtmlCompontent
          numberOfLines={3}
          source={{ html: data?.summary }}
          style={{ marginBottom: 8 }}
        /> */}
        {/* 封面 */}

        {data?.type === "image" && data?.images?.length > 0
          ? renderMedia()
          : data?.cover
            ? renderCover()
            : renderMedia()}
      </View>
      {/* 底部 */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 14,
          borderColor: Colors.border,
          borderBottomWidth: 1,
        }}
      >
        {(() => {
          const totalReactions = Object.keys(data?.reactionStats || {}).reduce(
            (acc, key) => {
              const value = data.reactionStats[key];
              return acc + (value || 0);
            },
            0,
          );
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  flex: 1,
                }}
              >
                <Eye color={Colors.secondary} size={18} />
                <Text style={{ color: Colors.secondary, fontSize: 12 }}>
                  {data?.views}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    totalReactions > 0 ? "space-between" : "flex-end",
                  alignItems: "center",
                  gap: 48,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <MessageCircleMore size={18} />
                  <Text style={{ fontSize: 12 }}>{data?.views}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <ThumbsUp size={18} />
                  <Text style={{ fontSize: 12 }}>{data?.likes}</Text>
                </View>
              </View>
            </View>
          );
        })()}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerInfoUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  headerMenu: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(ArticleCard);
