import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  product: string;
  batch: string;
  market: string;
};

const SocialMetrics: React.FC<Props> = ({ product, batch, market }) => {
  // This would be replaced with actual data fetching
  const socialData = {
    likes: 1500,
    views: 10000,
    shares: 500,
    comments: 200,
    sentiment: 0.8,
    effectiveness: 0.75,
    wishlist: 300,
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Social Metrics for {product} ({batch}) in {market}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h3 className="font-semibold">Likes</h3>
            <p className="text-2xl">{socialData.likes}</p>
          </div>
          <div>
            <h3 className="font-semibold">Views</h3>
            <p className="text-2xl">{socialData.views}</p>
          </div>
          <div>
            <h3 className="font-semibold">Shares</h3>
            <p className="text-2xl">{socialData.shares}</p>
          </div>
          <div>
            <h3 className="font-semibold">Comments</h3>
            <p className="text-2xl">{socialData.comments}</p>
          </div>
          <div>
            <h3 className="font-semibold">Sentiment</h3>
            <p className="text-2xl">{(socialData.sentiment * 100).toFixed(1)}%</p>
          </div>
          <div>
            <h3 className="font-semibold">Effectiveness</h3>
            <p className="text-2xl">{(socialData.effectiveness * 100).toFixed(1)}%</p>
          </div>
          <div>
            <h3 className="font-semibold">Wishlist</h3>
            <p className="text-2xl">{socialData.wishlist}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMetrics;