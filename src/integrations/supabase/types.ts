export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          availability_date: string
          cover_letter_url: string | null
          created_at: string | null
          current_company: string
          current_position: string
          current_salary: number
          education_level: string
          email: string
          expected_salary: number
          first_name: string
          first_name_ar: string
          github: string | null
          graduation_year: number | null
          id: string
          languages: string[] | null
          last_name: string
          last_name_ar: string
          linkedin: string | null
          major: string | null
          notice_period: string
          phone: string
          portfolio_url: string | null
          position_applied_for: string
          resume_url: string | null
          skills: string[] | null
          special_motivation: string
          university: string | null
          years_of_experience: string
        }
        Insert: {
          availability_date: string
          cover_letter_url?: string | null
          created_at?: string | null
          current_company: string
          current_position: string
          current_salary: number
          education_level: string
          email: string
          expected_salary: number
          first_name: string
          first_name_ar: string
          github?: string | null
          graduation_year?: number | null
          id?: string
          languages?: string[] | null
          last_name: string
          last_name_ar: string
          linkedin?: string | null
          major?: string | null
          notice_period: string
          phone: string
          portfolio_url?: string | null
          position_applied_for: string
          resume_url?: string | null
          skills?: string[] | null
          special_motivation: string
          university?: string | null
          years_of_experience: string
        }
        Update: {
          availability_date?: string
          cover_letter_url?: string | null
          created_at?: string | null
          current_company?: string
          current_position?: string
          current_salary?: number
          education_level?: string
          email?: string
          expected_salary?: number
          first_name?: string
          first_name_ar?: string
          github?: string | null
          graduation_year?: number | null
          id?: string
          languages?: string[] | null
          last_name?: string
          last_name_ar?: string
          linkedin?: string | null
          major?: string | null
          notice_period?: string
          phone?: string
          portfolio_url?: string | null
          position_applied_for?: string
          resume_url?: string | null
          skills?: string[] | null
          special_motivation?: string
          university?: string | null
          years_of_experience?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
