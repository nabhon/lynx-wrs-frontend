"use client";

import * as React from "react";
import type { MyTaskDto } from "@/services/taskService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FlatTaskTable from "./FlatTaskTable";

export default function TaskTabs({
  active,
  review,
}: {
  active: MyTaskDto[];
  review: MyTaskDto[];
}) {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList>
        <TabsTrigger value="active">My Tasks</TabsTrigger>
        <TabsTrigger value="review">Pending Review</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <FlatTaskTable items={active} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="review" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <FlatTaskTable items={review} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
