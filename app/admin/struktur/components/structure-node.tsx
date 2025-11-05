"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { User } from "lucide-react";
import Image from "next/image";

export type StructureNodeData = {
  id: string;
  jabatan: string;
  nama: string;
  nip: string | null;
  fotoUrl: string | null;
  level: number;
};

function StructureNode({ data, selected }: NodeProps) {
  const nodeData = data as StructureNodeData;

  const getLevelColor = (level: number) => {
    const colors = [
      "from-blue-600 to-blue-700",
      "from-green-600 to-green-700",
      "from-purple-600 to-purple-700",
      "from-orange-600 to-orange-700",
    ];
    return colors[level % colors.length];
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md transition-all ${
        selected
          ? "ring-4 ring-blue-500 ring-opacity-50 shadow-xl"
          : "hover:shadow-lg"
      }`}
      style={{ width: 350 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-400!"
      />

      <div
        className={`bg-linear-to-r ${getLevelColor(
          nodeData.level
        )} text-white px-4 py-3 rounded-t-lg`}
      >
        <h3 className="font-semibold text-sm text-center leading-tight">
          {nodeData.jabatan}
        </h3>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="shrink-0 self-center">
          {nodeData.fotoUrl ? (
            <Image
              src={nodeData.fotoUrl}
              alt={nodeData.nama}
              width={150}
              height={150}
              className="rounded object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-slate-100 rounded flex items-center justify-center">
              <User className="w-10 h-10 text-slate-400" />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="font-semibold text-slate-900 text-sm leading-tight mb-1">
            {nodeData.nama}
          </p>
          {nodeData.nip && (
            <p className="text-xs text-slate-600">NIP: {nodeData.nip}</p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-slate-400!"
      />
    </div>
  );
}

export default memo(StructureNode);
